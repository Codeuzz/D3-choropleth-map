import './style.css'
import * as d3 from "d3";

document.querySelector('#app').innerHTML = `
  <div id="container">
    <div id="text">
      <h1 id="title">United States Educational Attainment</h1>
      <h3 id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h3>
    </div>
  </div>
`

const EDUCATION_FILE =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const COUNTY_FILE =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.json(COUNTY_FILE)
  .then(data => makeMap(data))
  .catch(err => console.log(err));

const makeMap = (bb) => {
  console.log(bb)

  let width = 960, height = 600;
  let path = d3.geoPath()

  let svg = d3.select("#container").append('svg')
    .style("width", width).style("height", height);

  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(bb, bb.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', '#088')
    .attr('stroke', '#000')
    .attr('class', 'county')
}
  

