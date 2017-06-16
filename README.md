# Exoplanet Data Explorer

##Dataset
The dataset is from the Planetary Habitability Laboratory.
For the dataset processing, I removed the outlier by taking off the bottom and top 3% data.

##User Experience and User Flow
The web page pre-selected two features, and will populate a scatter plot and two histograms
as soon as data loaded. Users could switch the features in a dropwon menu. The webpage will then
generate a scatter plot and two histograms based on the new features.

For the distrubution/histogram chart, I added a CDF curve to highlight the trend and variation.
User could hide distrubution charts by clicking the bar chart icons.

For the scatterplot, each point of the scatterplot represents one planet, and each axis shows one
of the selected features. Users could select an area on the chart to zoom in and double click to
zoom out. When user hover on each point, a tooltip will pop up with the planet name and some other
features.

##Libraies Used
http://fontawesome.io/
font Awesome

http://getbootstrap.com/
Bootstrap

##References
https://bl.ocks.org/mbostock/3048450
Histogram - Mike Bostock

https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6
Brush & Zoom II - Mike Bostock

##Authors:
YUTING HAN
