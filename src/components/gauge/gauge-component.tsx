import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React from 'react';
// @ts-ignore
import LiquidFillGauge from 'react-liquid-gauge';

const startColor = '#6495ed'; // cornflowerblue
const endColor = '#dc143c'; // crimson

const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const percentage = (100 * value) / 100;
  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(percentage / 100);
  const gradientStops = [
    {
      key: '0%',
      stopColor: color(fillColor)?.darker(0.5).toString(),
      stopOpacity: 1,
      offset: '0%',
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%',
    },
    {
      key: '100%',
      stopColor: color(fillColor)?.brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: '100%',
    },
  ];

  return (
    <div style={{ padding: '40px', position: 'fixed' }}>
      <h2>Current happines value</h2>

      <LiquidFillGauge
        width={100}
        height={100}
        value={percentage}
        percent="%"
        textSize={1}
        textOffsetX={0}
        textOffsetY={0}
        textRenderer={(props: any) => {
          const value = Math.round(props.value);
          const radius = Math.min(props.height / 2, props.width / 2);
          const textPixels = (props.textSize * radius) / 2;
          const valueStyle = {
            fontSize: textPixels,
          };
          const percentStyle = {
            fontSize: textPixels * 0.6,
          };
          return (
            <tspan>
              <tspan className="value" style={valueStyle}>
                {value}
                <tspan style={percentStyle}>{props.percent}</tspan>
              </tspan>
            </tspan>
          );
        }}
        riseAnimation
        waveAnimation
        waveFrequency={2}
        waveAmplitude={1}
        gradient
        gradientStops={gradientStops}
        circleStyle={{
          fill: fillColor,
        }}
        waveStyle={{
          fill: fillColor,
        }}
        textStyle={{
          fill: color('#444')?.toString(),
        }}
        waveTextStyle={{
          fill: color('#fff')?.toString(),
        }}
      />
    </div>
  );
};

export default Gauge;
