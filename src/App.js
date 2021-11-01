import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import './App.css';

function App() {
  const [allPokemon, setPokemon] = useState([]);
  const [barTypes, setBarTypes] = useState([]);
  const [display, setDisplay] = useState('');
  const [barLayout, setBarLayout] = useState('vertical');
  const [barPosition, setBarPosition] = useState(false);
  const [lineTypes, setLineTypes] = useState([]);
  const [pieTypes, setPieTypes] = useState([]);
  const [innerRadius, setInnerRadius] = useState(0);
  const [circleTypes, setCircleTypes] = useState({});
  const [parent, showParent] = useState(true);

  useEffect(() => {
    const responsePokemon = async () => {
      const response = await getPokemon();
      setPokemon(response);
    }
    responsePokemon();
  }, [])

  useEffect(() => {
    getTypes()
  }, [allPokemon])

  const getTypes = () => {
    const allTypes = allPokemon.reduce((acc, pokemon) => {
      pokemon.types.forEach(type => {
        if (acc[type.type.name]) {
          acc[type.type.name]++
        } else {
          acc[type.type.name] = 1;
        }
      })
      return acc;
    }, {})

    const pokemonKeys = Object.keys(allTypes);
    setBarTypes(pokemonKeys.map(key => ({ type: key, count: allTypes[key]})));
    const lineData = {
      id: 'Pokemon',
      data: pokemonKeys.map(key => ({ x: key, y: allTypes[key] }))
    }
    setLineTypes([lineData]);
    setPieTypes(pokemonKeys.map(key => ({ id: key, label: key, value: allTypes[key] })))
    const circleData = {
      name: 'Pokemon',
      children: pokemonKeys.map(key => ({ name: key, value: allTypes[key] }))
    }
    setCircleTypes(circleData);
  }

  const getPokemon = async () => {
    try {
      const allPokemon = [];
      for ( let i = 1; i < 898; i++) {
        const fetched = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .then(response => response.json());
        allPokemon.push(fetched);
      }
      return allPokemon;
    } catch (e) {
      console.error(e);
    }
  }
  
  const barChart = () => {
    return(
      <ResponsiveBar 
        data={barTypes}
        keys={['count']}
        indexBy={'type'}
        margin={{ top: 50, right: 130, bottom: 50, left: 100 }}
        padding={0.2}
        layout={barLayout}
        reverse={barPosition}
        colorBy={'indexValue'}
        borderRadius={4}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 3,
          tickRotation: 30,
          legend: barLayout === 'vertical' ? 'Pokemon Types' : 'Number of Pokemon',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 3,
          tickRotation: 0,
          legend: barLayout === 'vertical' ? 'Number of Pokemon' : 'Pokemon Types',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        // enableLabel={false}
        label={d => `${d.value} Pokemon`}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 100,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
          }
        ]}
      />
    )
  }

  const lineChart = () => {
    console.log('here', lineTypes)
    return (
      <ResponsiveLine 
        data={lineTypes}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        curve='natural'
        lineWidth={4}
        pointSize={15}
        pointColor='#ffffff'
        pointBorderWidth={4}
        pointBorderColor={{ from: 'serieColor', modifiers: [] }}
        areaOpacity={0.15}
        useMesh={true}
        enableCrosshair={false}
        legends={[
          {
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 100,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
          }
        ]}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Pokemon Types',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Pokemon',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
      />
    )
  }

  const pieChart = () => {
    return (
      <ResponsivePie 
        data={pieTypes}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={innerRadius}
        padAngle={1}
        cornerRadius={6}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        enableArcLabels={false}
        arcLinkLabelsDiagonalLength={5}
        arcLinkLabelsStraightLength={5}
        arcLinkLabelsTextOffset={0}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
      />
    )
  }

  const circleChart = () => {
    return (
      <ResponsiveCirclePacking 
        data={circleTypes}
        id="name"
        value="value"
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        colors={{ scheme: 'nivo' }}
        childColor={{ from: 'color', modifiers: [ [ 'brighter', 0.4 ] ] }}
        colorBy="id"
        padding={4}
        enableLabels={true}
        labelsSkipRadius={10}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.5 ] ] }}
        leavesOnly={parent}
      />
    )
  }

  return (
    <div className="App">
      <h1>Pokemon</h1>
      <div>
        <button onClick={() => setDisplay('bar')}>Bar</button>
        <button onClick={() => setDisplay('line')}>Line</button>
        <button onClick={() => setDisplay('pie')}>Pie</button>
        <button onClick={() => setDisplay('circle')}>Circle</button>
      </div>
      {display === 'bar' &&
        <div>
          <div>
            <button onClick={() => setBarLayout('horizontal')}>Horizontal</button>
            <button onClick={() => setBarLayout('vertical')}>Vertical</button>
          </div>
          <div>
            <button onClick={() => setBarPosition(true)}>Top</button>
            <button onClick={() => setBarPosition(false)}>Bottom</button>
          </div>
          <section style={{ height: '50rem' }}>
            {barChart()}
          </section>
        </div>
      }
      {display === 'line' &&
        <section style={{ height: '50rem' }}>
          {lineChart()}
        </section>
      }
      {display === 'pie' &&
        <div>
          <div>
            <label for="radius">Inner Radius Value: </label>
            <input type='number' id="radius" onChange={(e) => setInnerRadius(e.target.value)}></input>
          </div>
          <section style={{ height: '30rem' }}>
            {pieChart()}
          </section>
        </div>
      }
      { display === 'circle' &&
        <div style={{ height: '30rem'}}>
          <button onClick={() => showParent(!parent)}>show/hide parent</button>
          {circleChart()}
        </div>
      }
    </div>
  );
}

export default App;
