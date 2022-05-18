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
  UIVisibilityModes,
  MarkerBuilders,
  UIBackgrounds,
  UIDirections,
  SolidLine,
  SolidFill,
  ColorRGBA,
  FunnelChartTypes,
  emptyLine,
  LegendBoxBuilders,
} from "@arction/lcjs";
import axios from "axios";
import React, { useRef, useEffect } from "react";
const XLSX = require("xlsx");

const Dash = (props) => {
  const { data, id } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
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
              y: -1 * Number(res.data[i]["_0108"]),
            });
            dataV1revertida.push({
              x: Number(res.data[i]["_0113"]),
              y: -1 * Number(res.data[i]["_0108"]),
            });
            dataprincia2.push({
              x: Date.parse(res.data[i]["DATETIME"]),
              y: -1 * Number(res.data[i]["_0110"]),
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
          const chartList = [];

          const exampleContainer =
            document.getElementById("chart") || document.body;

          const mainDiv = document.createElement("div");
          exampleContainer.append(mainDiv);
          mainDiv.style.position = "absolute";
          mainDiv.style.width = "100%";
          mainDiv.style.height = "100%";
          mainDiv.style.display = "flex";
          mainDiv.style.flexDirection = "column";
          mainDiv.style.color = "black";

          const uiDiv = document.createElement("div");
          mainDiv.append(uiDiv);
          uiDiv.style.display = "flex";
          uiDiv.style.flexDirection = "row";
          uiDiv.style.padding = "10px";
          uiDiv.style.backgroundColor =
            exampleContainer.parentElement.parentElement &&
            window.getComputedStyle(
              exampleContainer.parentElement.parentElement
            ).backgroundColor;
          uiDiv.style.color =
            exampleContainer.parentElement.parentElement &&
            window.getComputedStyle(
              exampleContainer.parentElement.parentElement
            ).color;

          const uiDivTitle = document.createElement("span");
          uiDiv.append(uiDivTitle);
          uiDivTitle.innerHTML = "Click para agregar gráfica";

          const nombresGrafica = ["principal", "horizontal", "vertical"];
          const seriesList = [];

          const dashDiv = document.createElement("div_dash");
          mainDiv.append(dashDiv);
          dashDiv.style.position = "relative";
          dashDiv.style.width = "100%";
          dashDiv.style.height = "100%";
          dashDiv.style.display = "flex";
          dashDiv.style.flexDirection = "row";

          const chartDiv = document.createElement("div");
          dashDiv.append(chartDiv);
          chartDiv.style.flexGrow = 3;

          const chartDiv2 = document.createElement("div2");
          dashDiv.append(chartDiv2);
          chartDiv2.style.flexGrow = 1;

          (() => {
            for (let i = 0; i < nombresGrafica.length; i++) {
              var label = nombresGrafica[i];

              const buttonAddChart = document.createElement("button");
              uiDiv.append(buttonAddChart);
              buttonAddChart.style.margin = "5px";
              buttonAddChart.innerHTML = label;
              buttonAddChart.style.whiteSpace = "nowrap";
              buttonAddChart.addEventListener("click", (e) => {
                if (nombresGrafica[i] == "vertical") {
                  addGraphVertical(label, nombresGrafica[i]);
                } else {
                  const graff = addGraph(label, nombresGrafica[i]);

                  if (nombresGrafica[i] == "principal") {
                    const serie1 = graff.serie1;
                    const serie2 = graff.serie2;
                    seriesList.push(serie1);
                    seriesList.push(serie2);
                  } else {
                    const serie1 = graff.serie1;
                    seriesList.push(serie1);
                  }

                  console.log(`selires list ${seriesList.length}`);

                  if (graff != false) {
                    chartList.push(graff.chart);
                    console.log(`chart list ${chartList.length}`);
                    synchronizeAxisIntervals(
                      ...chartList.map((chart) => chart.getDefaultAxisX())
                    );
                  }

                  function createResulTable(a) {
                    if (a === 0) {
                      const resultTable = db2
                        .createUIPanel({
                          columnIndex: 0,
                          rowIndex: 1,
                          columnSpan: 5,
                          rowSpan: 1,
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
                        .setDraggingMode(UIDraggingModes.notDraggable)
                        .setMargin(10)
                        .setPadding(10);
                      return resultTable;
                    }
                  }

                  const chart = chartList[0];

                  chart
                    .addUIElement(UIElementBuilders.ButtonBox)
                    .setPosition({ x: 40, y: 100 })
                    .setOrigin(UIOrigins.CenterTop)
                    .setText("Vista fija")
                    .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                    .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                    .setButtonOffSize(0)
                    .setButtonOnSize(0)
                    .setDraggingMode(UIDraggingModes.draggable)
                    .onMouseClick((event) => {
                      // Setup custom data cursor.
                      var buttonControl = 0;
                      crearCuadroVista(buttonControl);

                      const vistafija = chart
                        .addUIElement(UIElementBuilders.ButtonBox)
                        .setPosition({ x: 20, y: 100 })
                        .setOrigin(UIOrigins.CenterTop)
                        .setText("Vista fija grafica")
                        .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                        .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                        .setButtonOffSize(0)
                        .setButtonOnSize(0)
                        .setDraggingMode(UIDraggingModes.draggable)
                        .onMouseClick((event) => {
                          if (buttonControl == 0) {
                            buttonControl = 1;
                            crearCuadroVista(buttonControl);
                          }
                        });

                      function crearCuadroVista(buttonControl) {
                        const resultTable = createResulTable(buttonControl);
                        const resultTableRows = new Array(10)
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
                              {
                                x: chart.getDefaultAxisX(),
                                y: chart.getDefaultAxisY(),
                              }
                            ).x;
                            resultTableRows[0].setText(
                              "Fecha: " +
                                chart
                                  .getDefaultAxisX()
                                  .formatValue(mouseLocationAxisX)
                            );

                            for (let i = 0; i < seriesList.length; i += 1) {
                              const series = seriesList[i];
                              const nearestDataPoint =
                                series.solveNearestFromScreen(
                                  mouseLocationEngine
                                );
                              resultTableRows[1 + i].setText(
                                series.getName() +
                                  ": " +
                                  (nearestDataPoint
                                    ? chart
                                        .getDefaultAxisY()
                                        .formatValue(
                                          nearestDataPoint.location.y
                                        )
                                    : "")
                              );
                            }
                            if (buttonControl === 0) {
                              resultTable
                                .restore()
                                .setPosition({ y: 50, x: 50 });
                            } else {
                              resultTable
                                .restore()
                                .setPosition(mouseLocationEngine);
                            }
                            xTicks[0].restore().setValue(mouseLocationAxisX);
                            xTicks[0].restore().setValue(mouseLocationAxisX);
                          });
                        });
                      }
                    });
                }
              });
            }
          })();

          const maxCellsCount = 6;
          const maxCellsCountV = 1;
          // Se cread el Dash
          const db = lightningChart().Dashboard({
            container: chartDiv,
            theme: Themes.glacier,
            numberOfRows: maxCellsCount,
            numberOfColumns: maxCellsCountV,
            disableAnimations: true,
          });

          const db2 = lightningChart().Dashboard({
            container: chartDiv2,
            theme: Themes.glacier,
            numberOfRows: 2,
            numberOfColumns: 5,
            disableAnimations: true,
          });

          //.setSplitterStyle(emptyLine)
          //.setSplitterStyleHighlight(emptyLine);

          function crear2Dchart(a, b, c, d = 1, tipoGrafica = "horizontal") {
            var tipoDb = undefined;

            if (tipoGrafica === "vertical") {
              tipoDb = db2;
            } else {
              tipoDb = db;
            }

            const chart = tipoDb
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

            serie.setCursorResultTableFormatter(
              (builder, series, Xvalue, Yvalue) => {
                // Find cached entry for the figure.
                return builder
                  .addRow("")
                  .addRow("Fecha: " + series.axisX.formatValue(Xvalue))
                  .addRow("Profundidad: " + Yvalue.toFixed());
              }
            );

            serie2.setCursorResultTableFormatter(
              (builder, series, Xvalue, Yvalue) => {
                // Find cached entry for the figure.

                return builder
                  .addRow("")
                  .addRow("Fecha: " + series.axisX.formatValue(Xvalue))
                  .addRow("Profundidad: " + Yvalue.toFixed());
              }
            );

            chart.onSeriesBackgroundMouseClick((cursor) => {
              console.log(chart.getAxes());
            });

            chart.setAutoCursor((cursor) =>
              cursor
                .setResultTableAutoTextStyle(true)
                .setTickMarkerXAutoTextStyle(true)
                .setTickMarkerYAutoTextStyle(true)
            );

            chart.setPadding({ left: 10, right: 16, top: 10, bottom: 10 });

            chart.setTitle("");

            chart.getDefaultAxisX().onAxisInteractionAreaMouseClick((event) => {
              console.log("disssssssteee");
            });

            // Create a builder for SeriesMarker to allow for full modification of its structure.
            const SeriesMarkerBuilder = MarkerBuilders.XY.setPointMarker(
              UIBackgrounds.Diamond
            )
              .setResultTableBackground(UIBackgrounds.Pointer)
              .addStyler((marker) =>
                marker
                  .setPointMarker((point) => point.setSize({ x: 13, y: 13 }))
                  .setResultTable((table) =>
                    table
                      .setOrigin(UIOrigins.CenterBottom)
                      .setMargin({ bottom: 0 })
                      .setBackground((arrow) =>
                        arrow
                          .setDirection(UIDirections.Down)
                          .setPointerAngle(80)
                          .setPointerLength(100)
                      )
                  )
                  .setGridStrokeXCut(true)
                  .setAutoFitStrategy(undefined)
              );

            return {
              serie1: serie,
              serie2: serie2,
              grafica: chart,
              SeriesMarkerBuilder: SeriesMarkerBuilder,
            };
          }

          console.log("set chart data", data);

          function personalizarGradicas(grafica, nombre) {
            if (nombre == "principal") {
              const graficaPrincipal = grafica;
              graficaPrincipal.serie1.clear().add(dataprincial);
              graficaPrincipal.serie2.clear().add(dataprincia2);
              graficaPrincipal.grafica
                .getDefaultAxisY()
                .setTitle("Profundidad");
              graficaPrincipal.grafica.getDefaultAxisX().setTitle("Tiempo");

              graficaPrincipal.serie1.setName("[0108] DBTM");
              graficaPrincipal.serie2.setName("[0110] DMEA");
              // Add download button to save chart frame
              graficaPrincipal.grafica
                .getDefaultAxisX()
                .setTickStrategy(AxisTickStrategies.DateTime);

              //graficaPrincipal.grafica.getDefaultAxisY().setInterval(1, -1);

              graficaPrincipal.serie1.setCursorResultTableFormatter(
                (builder, series, Xvalue, Yvalue) => {
                  // Find cached entry for the figure.

                  return builder
                    .addRow("Evento ")
                    .addRow("Fecha: " + series.axisX.formatValue(Xvalue))
                    .addRow("Profundidad: " + Yvalue.toFixed());
                }
              );

              return graficaPrincipal.grafica;
            }
            if (nombre == "horizontal") {
              const graficaV1 = grafica;
              graficaV1.serie1.clear().add(dataV1);
              graficaV1.serie2.dispose();
              graficaV1.grafica
                .getDefaultAxisX()
                .setTickStrategy(AxisTickStrategies.Empty);
              //legend.add(graficaV1.grafica);
              return graficaV1.grafica;
            }
            if (nombre == "vertical") {
              const graficaV1 = grafica;
              graficaV1.serie1.clear().add(dataV1revertida);
              graficaV1.serie2.dispose();
              graficaV1.grafica
                .getDefaultAxisX()
                .setTickStrategy(AxisTickStrategies.Empty);
              //legend.add(graficaV1.grafica);
              return graficaV1.grafica;
            }
          }

          const charts = [];

          const updateDashboardRowHeights = () => {
            for (let row = 0; row < maxCellsCount; row += 1) {
              db.setRowHeight(row, 0);
            }
            charts.forEach((chart) => db.setRowHeight(chart.row, 1));
          };

          const addGraph = (name, nombre) => {
            const freeRow = new Array(maxCellsCount)
              .fill(0)
              .findIndex(
                (_, row) =>
                  charts.find((item) => item.row === row) === undefined
              );
            if (freeRow < 0) {
              // Dashboard has no more row slots.
              alert(
                `Dashboard is not allocated for more than ${maxCellsCount} graphs ${freeRow} `
              );
              return false;
            }

            const creacionGrafica = crear2Dchart(0, freeRow, 1, 1);
            const chart = personalizarGradicas(creacionGrafica, nombre);

            if (nombre == "principal") {
              chart
                .addUIElement(UIElementBuilders.ButtonBox)
                .setPosition({ x: 90, y: 100 })
                .setOrigin(UIOrigins.CenterTop)
                .setText("Download PNG")
                .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                .setButtonOffSize(0)
                .setButtonOnSize(0)
                .setDraggingMode(UIDraggingModes.draggable)
                .onMouseClick((event) => {
                  chart.saveToFile(" - Screenshot");
                });

              const getEventos = async (id) => {
                axios
                  .get("http://localhost:9000/api/eventos/wells/1")
                  .then((response) => {
                    if (response.status === 200) {
                      console.log("OK Eventos");
                      console.log(response.data);

                      const seriesMarkers = [];

                      chart
                        .addUIElement(UIElementBuilders.ButtonBox)
                        .setPosition({ x: 80, y: 100 })
                        .setOrigin(UIOrigins.CenterTop)
                        .setText("Ver eventos")
                        .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                        .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                        .setButtonOffSize(0)
                        .setButtonOnSize(0)
                        .setDraggingMode(UIDraggingModes.draggable)
                        .onMouseClick((event) => {
                          for (let i = 0; i < response.data.length; i++) {
                            // Add a SeriesMarker to the series.
                            const seriesMarker = creacionGrafica.serie1
                              .addMarker(creacionGrafica.SeriesMarkerBuilder)
                              .setPosition({
                                x: Date.parse(
                                  response.data[i]["fecha_inicial"]
                                ),
                              });

                            seriesMarkers.push(seriesMarker);

                            seriesMarker.setResultTableVisibility(
                              UIVisibilityModes.whenHovered
                            );
                          }
                        });

                      chart
                        .addUIElement(UIElementBuilders.ButtonBox)
                        .setPosition({ x: 60, y: 100 })
                        .setOrigin(UIOrigins.RightTop)
                        .setText("Ocultar eventos")
                        .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                        .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                        .setButtonOffSize(0)
                        .setButtonOnSize(0)
                        .setDraggingMode(UIDraggingModes.draggable)
                        .onMouseClick((event) => {
                          for (let i = 0; i < seriesMarkers.length; i++) {
                            seriesMarkers[i].dispose();
                          }
                        });
                    } else {
                      console.log(
                        "Ocurrió un error consultado los eventos del pozo, intente nuevamente"
                      );
                      console.log(response.data);
                    }
                  })
                  .catch((error) => {
                    console.log(
                      "Ocurrió un error consultado los eventos del pozo, intente nuevamente"
                    );
                    console.log(error.message);
                  });
              };

              getEventos();

              // Create a LegendBox for Candle-Stick and Bollinger Band
              const legendBoxOHLC = chart
                .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
                // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
                .setAutoDispose({
                  type: "max-width",
                  maxWidth: 0.3,
                });

              legendBoxOHLC.add(chart);
            }

            chart.setPadding({ top: 30, right: 45, bottom: 1, left: 1 });

            chart
              .addUIElement(UIElementBuilders.ButtonBox)
              .setPosition({ x: 99, y: 100 })
              .setOrigin(UIOrigins.CenterTop)
              .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
              .setText("x")
              .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
              .setButtonOffSize(0)
              .setButtonOnSize(0)
              .setDraggingMode(UIDraggingModes.draggable)
              .onMouseClick((event) => {
                chart.dispose();

                chartList.splice(
                  chartList.findIndex((item) => item.chart === chart),
                  1
                );

                charts.splice(
                  charts.findIndex((item) => item.chart === chart),
                  1
                );
                updateDashboardRowHeights();
                charts.forEach((item) => item.updatePosition());
              });

            if (nombre == "principal") {
              chart
                .addUIElement(UIElementBuilders.ButtonBox)
                .setPosition({ x: 99, y: 95 })
                .setOrigin(UIOrigins.CenterTop)
                .setMargin({ top: 5, right: 1, bottom: 1, left: 1 })
                .setText("3D")
                .setPadding({ top: 1, right: 1, bottom: 1, left: 1 })
                .setButtonOffSize(0)
                .setButtonOnSize(0)
                .setDraggingMode(UIDraggingModes.draggable)
                .onMouseClick((event) => {
                  chart.dispose();

                  const char3D = db.createChart3D({
                    columnIndex: 0,
                    rowIndex: 0,
                    columnSpan: 1,
                    rowSpan: 1,
                  });

                  const getDatosFallas = async (id) => {
                    axios
                      .get("http://localhost:3001/datosfallas")
                      .then((response) => {
                        if (response.status === 200) {
                          console.log("OK fallas");
                          console.log(response.data.length);

                          const data3Dfallas = [];

                          for (let i = 0; i < response.data.length; i++) {
                            data3Dfallas.push({
                              x: response.data[i]["X"],
                              y: response.data[i]["Y"],
                              z: response.data[i]["Z"],
                            });
                          }

                          char3D.addPointSeries().add(data3Dfallas);
                        } else {
                          console.log(
                            "Ocurrió un error consultado los datos de fallas"
                          );
                          console.log(response.data);
                        }
                      })
                      .catch((error) => {
                        console.log(
                          "Ocurrió un error consultado los datos de fallas"
                        );
                        console.log(error.message);
                      });
                  };

                  getDatosFallas();
                });
            }

            const updatePosition = () => {
              const posEngine = translatePoint(
                { x: 100, y: 100 },
                chart.uiScale,
                chart.engine.scale
              );
              const posDocument = chart.engine.engineLocation2Client(
                posEngine.x,
                posEngine.y
              );
            };

            charts.push({
              row: freeRow,
              chart,
              updatePosition,
            });
            updateDashboardRowHeights();
            charts.forEach((item) => item.updatePosition());

            if (nombre == "principal") {
              const serie1 = creacionGrafica.serie1;
              const serie2 = creacionGrafica.serie2;
              return { chart: chart, serie1: serie1, serie2: serie2 };
            } else {
              const serie1 = creacionGrafica.serie1;
              return { chart: chart, serie1: serie1 };
            }
          };

          const chartsVertical = [];

          const updateDashboardRowHeightsVertical = () => {
            for (let row = 0; row < 5; row += 1) {
              db2.setColumnWidth(row, 0);
            }
            chartsVertical.forEach((chart) => db2.setColumnWidth(chart.row, 1));
          };

          const addGraphVertical = (name, nombre) => {
            let freeRow = new Array(5)
              .fill(0)
              .findIndex(
                (_, row) =>
                  chartsVertical.find((item) => item.row === row) === undefined
              );
            if (freeRow < 0) {
              // Dashboard has no more row slots.
              alert(`Dashboard is not allocated for more than ${5} graphs`);
              return false;
            }

            const creacionGrafica = crear2Dchart(freeRow, 0, 1, 1, "vertical");
            const chart2 = personalizarGradicas(creacionGrafica, nombre);
            console.log(freeRow);
            console.log(typeof freeRow);

            chart2.getDefaultAxisY().setTickStrategy(AxisTickStrategies.Empty);

            chart2
              .addUIElement(UIElementBuilders.ButtonBox)
              .setPosition({ x: 102, y: 100 })
              .setOrigin(UIOrigins.RightTop)
              .setText("x")
              .setPadding({ top: 5, right: 5, bottom: 5, left: 5 })
              .setButtonOffSize(0)
              .setButtonOnSize(0)
              .setDraggingMode(UIDraggingModes.notDraggable)
              .onMouseClick((event) => {
                chart2.dispose();

                chartsVertical.splice(
                  chartsVertical.findIndex((item) => item.chart === chart2),
                  1
                );
                updateDashboardRowHeightsVertical();
                chartsVertical.forEach((item) => item.updatePosition());
              });

            const updatePosition = () => {
              const posEngine = translatePoint(
                { x: 100, y: 100 },
                chart2.uiScale,
                chart2.engine.scale
              );
              const posDocument = chart2.engine.engineLocation2Client(
                posEngine.x,
                posEngine.y
              );
              //buttonRemoveChart.style.left = `${posDocument.x}px`;
              //buttonRemoveChart.style.top = `${posDocument.y}px`;
            };

            chartsVertical.push({
              row: freeRow,
              chart2,
              updatePosition,
            });
            updateDashboardRowHeightsVertical();
            chartsVertical.forEach((item) => item.updatePosition());

            return chart2;
          };
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
