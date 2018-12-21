
# Exploring human knowledge through Wikipedia usage
“Exploring human knowledge through Wikipedia usage” is an unbiased data visualization app, that can be used to observe Wikipedia user search trends. It is part of the EPFL course "Data Visualization".

## Demo 
You can see our visualization in action, in the following URL: https://ividim.github.io/DataViz/

## File Structure

assets: This folder contains the front-end part of the application.
data: Contains standalone data files that are used by the app.
server: Contains the back-end part of the application.
vendor: Contains external Javascript libraries, used in the front-end part of the app.

## Authors
Hyun Jii Cho, Ivi Dimopoulou, Kirusanth Poopalasingam

## Technical Details
### How to import Wikipedia dumps
#### 1. Download files
Download the "pagecounts-{}-{}-views-ge-5.bz2" files from :
https://dumps.wikimedia.org/other/pagecounts-ez/merged/

#### 2. Unzip
This command will unzip the file and remove the original file
> bzip2 -d pagecounts-2016-10-views-ge-5.bz2

#### 3. Keep only english articles

This command get english articles and write it in a separate file
> grep '^en\.z' pagecounts-2016-10-views-ge-5 >  pagecounts-2016-10-views-ge-5-cleaned

#### 4. Get peakday
Execute the wiki/run.py which will keep only articles with certain amount of views and write them in a separate file.
> python run.py


