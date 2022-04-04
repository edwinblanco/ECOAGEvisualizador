import { lightningChart, Themes, AxisTickStrategies } from "@arction/lcjs";
import axios from "axios";
import React, { useRef, useEffect } from "react";

const Dash = (props) => {
  const { data, id } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
    // Se cread el Dash
    const db = lightningChart().Dashboard({
      theme: Themes.glacier,
      numberOfRows: 11,
      numberOfColumns: 4,
    });

    // Create a legendBox docked to the Dashboard.
    const legend = db.createLegendBoxPanel({
      columnIndex: 3,
      rowIndex: 0,
      columnSpan: 1,
      rowSpan: 1,
    });

    function crear2Dchart(a, b, c, d) {
      const chart = db
        .createChartXY({
          columnIndex: a,
          rowIndex: b,
          columnSpan: c,
          rowSpan: d,
        })
        .setTitle("Live sales")
        .setPadding({ right: 30 })
        .setMouseInteractionsWhileScrolling(true);

      chart.getDefaultAxisY().setInterval(1, -1);

      const serie = chart.addLineSeries();
      const serie2 = chart.addLineSeries();

      chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime);

      return { series: { serie1: serie, serie2: serie2 }, grafica: chart };
    }

    // se crea la funcion que genera la grafica

    chartRef.current = { db, legend, crear2Dchart };

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log("destroy chart");
      db.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) return;

    // Set chart data.
    const { crear2Dchart, legend } = components;
    console.log("set chart data", data);

    //hacemos la peticion axios y creamos las graficas
    axios
      .get("http://localhost:9000/api/datos_wits/wells/1/0", {
        responseType: "json",
      })
      .then(function (res) {
        if (res.status == 200) {
          console.log(res.data.length);
          //console.log(res.data);
          const dataprincial = [];
          const dataprincia2 = [];
          const dataV1 = [];
          const dataV2 = [];
          const dataV3 = [];
          const dataV4 = [];
          const dataV5 = [];

          for (let i = 0; i < res.data.length; i++) {
            dataprincial.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0108"]),
            });
            dataprincia2.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0110"]),
            });
            dataV1.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0113"]),
            });
            dataV2.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0116"]),
            });
            dataV3.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0118"]),
            });
            dataV4.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0120"]),
            });
            dataV5.push({
                x: Date.parse(res.data[i]["DATETIME"]),
                y: Number(res.data[i]["_0130"]),
              });
          }

          console.log(dataprincial);

          const graficaPrincipal = crear2Dchart(0, 0, 3, 5);
          graficaPrincipal.series.serie1.clear().add(dataprincial);
          graficaPrincipal.series.serie2.clear().add(dataprincia2);
          legend.add(graficaPrincipal.grafica);

          const graficaV1 = crear2Dchart(0, 5, 3, 2);
          graficaV1.series.serie1.clear().add(dataV1);
          legend.add(graficaV1.grafica);

          const graficaV2 = crear2Dchart(0, 7, 3, 2);
          graficaV2.series.serie1.clear().add(dataV2);
          legend.add(graficaV2.grafica);

          const graficaV3 = crear2Dchart(0, 9, 3, 2);
          graficaV3.series.serie1.clear().add(dataV2);
          legend.add(graficaV3.grafica);

        }
        //console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [data, chartRef]);

  return <div id={id} className="dash"></div>;
};

export default Dash;
