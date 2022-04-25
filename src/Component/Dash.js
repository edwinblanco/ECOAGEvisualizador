import {
  lightningChart,
  Themes,
  AxisTickStrategies,
  synchronizeAxisIntervals,
  UILayoutBuilders,
  UIOrigins,
  UIElementBuilders,
  AutoCursorModes,
  translatePoint,
  EmptyFill,
  UIDraggingModes,
} from "@arction/lcjs";
import axios from "axios";
import React, { useRef, useEffect } from "react";

const Dash = (props) => {
  const { data, id } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
    // Se cread el Dash
    const db = lightningChart().Dashboard({
      theme: Themes.glacier,
      numberOfRows: 13,
      numberOfColumns: 8,
    });

    // Create a legendBox docked to the Dashboard.
    const legend = db.createLegendBoxPanel({
      columnIndex: 0,
      rowIndex: 0,
      columnSpan: 8,
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

      const serie = chart.addLineSeries();
      const serie2 = chart.addLineSeries();

      serie.setCursorResultTableFormatter((builder, series, Xvalue, Yvalue) => {
        // Find cached entry for the figure.
        return builder
          .addRow("")
          .addRow("Fecha: " + series.axisX.formatValue(Xvalue))
          .addRow("Profundidad: " + Yvalue.toFixed());
      });

      serie2.setCursorResultTableFormatter(
        (builder, series, Xvalue, Yvalue) => {
          // Find cached entry for the figure.
          return builder
            .addRow("")
            .addRow("Fecha: " + series.axisX.formatValue(Xvalue))
            .addRow("Profundidad: " + Yvalue.toFixed());
        }
      );

      chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime);

      chart.setAutoCursor((cursor) =>
        cursor
          .setResultTableAutoTextStyle(true)
          .setTickMarkerXAutoTextStyle(true)
          .setTickMarkerYAutoTextStyle(true)
      );

      chart.setPadding({ left: 10, right: 16, top: 10, bottom: 10 });

      chart.setTitle("");

      return { serie1: serie, serie2: serie2, grafica: chart };
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
    const { crear2Dchart, legend, db } = components;
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
          const dataV1revertida = [];

          for (let i = 0; i < res.data.length; i++) {
            dataprincial.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: Number(res.data[i]["_0108"]),
            });
            dataV1revertida.push({
              x: Number(res.data[i]["_0108"]), 
              y: Date.parse(res.data[i]["DATETIME"]),
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

          const graficaPrincipal = crear2Dchart(0, 1, 5, 7);
          graficaPrincipal.serie1.clear().add(dataprincial);
          graficaPrincipal.serie2.clear().add(dataprincia2);
          graficaPrincipal.grafica.getDefaultAxisY().setTitle("Profundidad");
          graficaPrincipal.grafica.getDefaultAxisX().setTitle("Tiempo");
          graficaPrincipal.grafica.getDefaultAxisY().setInterval(1, -1);
          graficaPrincipal.serie1.setName("[0108] DBTM");
          graficaPrincipal.serie2.setName("[0110] DMEA");
          // Add download button to save chart frame
          graficaPrincipal.grafica
            .addUIElement(UIElementBuilders.ButtonBox)
            .setPosition({ x: 99, y: 99 })
            .setOrigin(UIOrigins.RightTop)
            .setText("Download PNG")
            .setPadding({ top: 5, right: 5, bottom: 5, left: 5 })
            .setButtonOffSize(0)
            .setButtonOnSize(0)
            .setDraggingMode(UIDraggingModes.notDraggable)
            .onMouseClick((event) => {
              graficaPrincipal.grafica.saveToFile(" - Screenshot");
            });
          legend.add(graficaPrincipal.grafica);

          const graficaV1 = crear2Dchart(0, 8, 5, 1);
          graficaV1.serie1.clear().add(dataV1);
          graficaV1.serie2.dispose();
          graficaV1.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV1.grafica);

          const graficaV2 = crear2Dchart(0, 9, 5, 1);
          graficaV2.serie1.clear().add(dataV2);
          graficaV2.serie2.dispose();
          graficaV2.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV2.grafica);

          const graficaV3 = crear2Dchart(0, 10, 5, 1);
          graficaV3.serie1.clear().add(dataV3);
          graficaV3.serie2.dispose();
          graficaV3.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV3.grafica);

          const graficaV4 = crear2Dchart(0, 11, 5, 1);
          graficaV4.serie1.clear().add(dataV4);
          graficaV4.serie2.dispose();
          graficaV4.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV4.grafica);

          const graficaV5 = crear2Dchart(0, 12, 5, 1);
          graficaV5.serie1.clear().add(dataV5);
          graficaV5.serie2.dispose();
          graficaV5.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV5.grafica);

          const graficaV5revertida = crear2Dchart(5, 1, 1, 7);
          graficaV5revertida.serie1.clear().add(dataV1revertida);
          graficaV5revertida.serie2.dispose();
          graficaV5revertida.grafica
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty);
            graficaV5revertida.grafica
            .getDefaultAxisY()
            .setTickStrategy(AxisTickStrategies.Empty);
          legend.add(graficaV5.grafica);

          const chartList = [
            graficaPrincipal.grafica,
            graficaV1.grafica,
            graficaV2.grafica,
            graficaV3.grafica,
            graficaV4.grafica,
            graficaV5.grafica,
          ];

          const seriesList = [
            graficaPrincipal.serie1,
            graficaPrincipal.serie2,
            graficaV1.serie1,
            graficaV2.serie1,
            graficaV3.serie1,
            graficaV4.serie1,
            graficaV5.serie1,
          ];
          console.log(seriesList);

          function createResulTable(a) {
            if (a === 0) {
              const resultTable = db
                .createUIPanel({
                  columnIndex: 5,
                  rowIndex: 8,
                  columnSpan: 3,
                  rowSpan: 5,
                })
                .addUIElement(UILayoutBuilders.Column)
                .setMouseInteractions(false)
                .setMargin(0)
                .setPadding(5);

              return resultTable;
            }
            if (a === 1) {
              const resultTable = db
                .addUIElement(UILayoutBuilders.Column, db.engine.scale)
                .setMouseInteractions(false)
                .setMargin(10)
                .setPadding(10);
              return resultTable;
            }
          }

          const resultTableo = db
            .createUIPanel({
              columnIndex: 5,
              rowIndex: 8,
              columnSpan: 3,
              rowSpan: 5,
            })
            .addUIElement(UIElementBuilders.ButtonBox)
            .setText("Cambiar vista2")
            .setPadding({ top: 5, right: 5, bottom: 5, left: 5 })
            .setPosition({ x: 30, y: 90 })
            .onMouseClick((event) => {
              // Setup custom data cursor.
              var buttonControl = 0;
              crearCuadroVista(buttonControl);

              const resultTable2 = db
                .createUIPanel({
                  columnIndex: 5,
                  rowIndex: 8,
                  columnSpan: 3,
                  rowSpan: 5,
                })
                .addUIElement(UIElementBuilders.ButtonBox)
                .setText("Cambiar vista")
                .setPadding({ top: 5, right: 5, bottom: 5, left: 5 })
                .setPosition({ x: 70, y: 90 })
                .onMouseClick((event) => {
                  if (buttonControl == 0) {
                    buttonControl = 1;
                    crearCuadroVista(buttonControl);
                  }
                });

              function crearCuadroVista(buttonControl) {
                const resultTable = createResulTable(buttonControl);
                const resultTableRows = new Array(8)
                  .fill(0)
                  .map((_) =>
                    resultTable.addElement(UIElementBuilders.TextBox)
                  );
                resultTable.dispose();

                const xTicks = chartList.map((chart) =>
                  chart.getDefaultAxisX().addCustomTick().dispose()
                );

                chartList.forEach((chart) => {
                  chart.setAutoCursorMode(AutoCursorModes.disabled);
                  chart.onSeriesBackgroundMouseMove((_, event) => {
                    const mouseLocationEngine =
                      chart.engine.clientLocation2Engine(
                        event.clientX,
                        event.clientY
                      );
                    const mouseLocationAxisX = translatePoint(
                      mouseLocationEngine,
                      chart.engine.scale,
                      { x: chart.getDefaultAxisX(), y: chart.getDefaultAxisY() }
                    ).x;
                    resultTableRows[0].setText(
                      "Fecha: " +
                        chart.getDefaultAxisX().formatValue(mouseLocationAxisX)
                    );

                    for (let i = 0; i < 7; i += 1) {
                      const series = seriesList[i];
                      const nearestDataPoint =
                        series.solveNearestFromScreen(mouseLocationEngine);
                      resultTableRows[1 + i].setText(
                        series.getName() +
                          ": " +
                          (nearestDataPoint
                            ? chart
                                .getDefaultAxisY()
                                .formatValue(nearestDataPoint.location.y)
                            : "")
                      );
                    }
                    if (buttonControl === 0) {
                      resultTable.restore().setPosition({ y: 50, x: 50 });
                    } else {
                      resultTable.restore().setPosition(mouseLocationEngine);
                    }
                    xTicks[0].restore().setValue(mouseLocationAxisX);
                    xTicks[5].restore().setValue(mouseLocationAxisX);
                  });
                });

                const resultTable3 = db
                  .createUIPanel({
                    columnIndex: 5,
                    rowIndex: 8,
                    columnSpan: 3,
                    rowSpan: 5,
                  })
                  .addUIElement(UIElementBuilders.ButtonBox)
                  .setText("Ocultar vista")
                  .setPadding({ top: 5, right: 5, bottom: 5, left: 5 })
                  .setPosition({ x: 50, y: 10 })
                  .onMouseClick((event) => {
                    resultTable.dispose();
                  });
              }
              
            });
            synchronizeAxisIntervals(
              ...chartList.map((chart) => chart.getDefaultAxisX())
            );
            
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
