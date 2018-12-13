# data_viz
Website url: https://ividim.github.io/DataViz/


## The wikidump file structure

### 1. Download wikipedia files
From: https://dumps.wikimedia.org/other/pagecounts-ez/merged/

Three files per month are provided:
- pagecounts-2018-09-views-ge-5-totals.bz2 (unzipped 2.2G): contains the article id and the total count of the month

2. Unzip them
3. Keep only english:
grep '^en\.z' <input> > <output>


Issues:
- no mobile view (yet, easy to add )
- keep only articles with >10k views




