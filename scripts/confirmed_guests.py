#!/usr/bin/env python3
"""
scripts/confirmed_guests.py

Usage:
  python3 scripts/confirmed_guests.py --sheet-url "https://docs.google.com/spreadsheets/d/<<SHEET_ID>>/export?format=csv&gid=0" --out data/confirmed.csv

This script downloads the public CSV export of a Google Sheet and writes a filtered CSV
containing only rows where the RSVP/`accompagne` column indicates presence ("Oui").
It is intentionally simple and runs locally.

If your sheet columns differ, pass --col-name overrides.
"""

import argparse
import csv
import sys
from urllib.request import urlopen
from io import TextIOWrapper


def download_csv(sheet_url):
    try:
        resp = urlopen(sheet_url)
        # Google returns bytes; wrap for text
        text = TextIOWrapper(resp, encoding='utf-8')
        reader = csv.DictReader(text)
        rows = list(reader)
        return rows
    except Exception as e:
        print(f"Erreur téléchargement CSV: {e}")
        sys.exit(1)


def filter_confirmed(rows, rsvp_field):
    out = []
    for r in rows:
        val = r.get(rsvp_field, '').strip().lower()
        if val in ('oui', 'yes', 'y', '1', 'true'):
            out.append(r)
    return out


def write_csv(path, rows, fieldnames):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow({k: r.get(k, '') for k in fieldnames})


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--sheet-url', required=True, help='Google Sheet CSV export URL (format=csv)')
    p.add_argument('--out', default='data/confirmed.csv', help='Output CSV path')
    p.add_argument('--rsvp-field', default='accompagne', help='Column name to check for RSVP yes/oui')
    args = p.parse_args()

    rows = download_csv(args.sheet_url)
    if not rows:
        print('Aucune ligne trouvée dans la feuille')
        sys.exit(0)

    confirmed = filter_confirmed(rows, args.rsvp_field)

    # determine fieldnames (keep original columns order if possible)
    fieldnames = rows[0].keys()
    write_csv(args.out, confirmed, fieldnames)
    print(f'Wrote {len(confirmed)} confirmed rows to {args.out}')


if __name__ == '__main__':
    main()
