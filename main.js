import './style.css'
import * as d3 from "d3";

document.querySelector('#app').innerHTML = `
  <div id="container">
    <div id="text">
      <h1 id="title">United States Educational Attainment</h1>
      <h3 id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h3>
    </div>
  </div>
  <div id="tooltip"></div>
  <div id="source">Source: <a href='https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx' target='_blank'>USDA Economic Research Service</a></div>

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
      makeMap(countyData, educationData)
      makeStates(countyData)
      makeLegend()
    })
    .catch(err => console.log('Error:', err));


let width = 960, height = 600;
let path = d3.geoPath()

let svg = d3.select("#container").append('svg')
  .style("width", width).style("height", height);

let color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeBlues[9]);

const makeMap = (countyData, educationData) => {
let counties = topojson.feature(countyData, countyData.objects.counties).features
let tooltip = d3.select('#tooltip')







  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(counties)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => {
      let countyX = educationData.find(item => item.fips === d.id)
      return countyX ? color(countyX.bachelorsOrHigher) : "#0000"
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', '0.2')
    .attr('class', 'county')
    .attr('data-fips', d => d.id)
    .attr('data-education', d => {
      let countyX = educationData.find(item => item.fips === d.id)
      return countyX.bachelorsOrHigher
    })
    .on('mouseover', (event, d) => {
      let countyX = educationData.find(item => item.fips === d.id)

      tooltip.style('opacity', '1')
      .html(`
        ${countyX['area_name']}, ${countyX.state}: ${countyX.bachelorsOrHigher}%`)
      .style('top', `${event.pageY - 45}px`)
      .style('left', `${event.pageX}px`)
      .attr('data-education', countyX.bachelorsOrHigher)
    })
    .on('mouseout', () => {
      tooltip.style('opacity', '0')
    })

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


const makeLegend = () => {
  let colorArray = d3.schemeBlues[9]
  colorArray.splice(0, 2)

  let legendX = d3.scaleLinear()
    .domain([3, 66])
    .range([0, 25 * 9]);

  const tickValues = [3, 12, 21, 30, 39, 48, 57, 66];

  const legendAxis = d3.axisBottom(legendX)
    .tickValues(tickValues)
    .tickFormat(d => `${d}%`)

  d3.select("svg")
  .append('g')
  .attr("transform", `translate(600, ${55.5})`)
  .call(legendAxis)

  
  
  svg.append('g')
  .attr('id', 'legend')
  .attr('y', 400)
  .selectAll('rect')
  .data(colorArray)
  .enter()
  .append('rect')
  .attr('width', 225 / 7)
  .attr('height', 15)
  .attr('x', (d,i) => (i  * 32.14) + 600)
  .attr('y', 40)
  .style('fill', d => d)
}
  

