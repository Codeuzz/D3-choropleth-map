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

  Promise.all([
    d3.json(COUNTY_FILE),
    d3.json(EDUCATION_FILE)
  ])
    .then(([countyData, educationData]) => {
      makeMap(countyData)
      makeStates(countyData)
      console.log('County Data:', countyData);
      console.log('Education Data:', educationData);
    })
    .catch(err => console.log('Error:', err));


let width = 960, height = 600;
let path = d3.geoPath()

let svg = d3.select("#container").append('svg')
  .style("width", width).style("height", height);

let color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemePurples[9]);

const makeMap = (countyData, educationData) => {
let counties = topojson.feature(countyData, countyData.objects.counties).features

console.log('ici', counties)

  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(counties)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', color(53))
    .attr('stroke', '#fff')
    .attr('stroke-width', '0.2')
    .attr('class', 'county')
    .attr('data-fips', d => d.id)

  // d3.selectAll('.county')
  //   .data(educationData)
  //   .enter()
}


const makeStates = data => {
  svg.append('g')
    .attr('class', 'states')
    .selectAll('path')
    .data(topojson.feature(data, data.objects.states).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', '#fff')
    .attr('stroke-width', '0.5')
    .attr('fill', 'none')
    .attr('class', 'state')
}
  

