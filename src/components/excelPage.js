import React, { Component } from "react";
import { Table, Button, Popover, Row, Col, Icon, Upload } from "antd";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../utils/editable";
import Select from 'react-select'
import { Line } from 'react-chartjs-2'

export default class ExcelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      sortedRows: [],
      errorMessage: null,
      data:{
      labels: [],
          datasets: [
        {
          label: "Speed",
          data: []
        }
      ]
      },
      columns: [
        {
          title: "Time From",
          dataIndex: "timeFrom"
        },
        {
          title: "Time To",
          dataIndex: "timeTo"
        },
        {
          title: "Speed",
          dataIndex: "speed"
        },
        {
          title: "Przep.wody nat.zas.str.1,P2",
          dataIndex: "i1"
        },
        {
          title: "Przep.wody nat.zas.str.2,P2",
          dataIndex: "i2"
        },
        {
          title: "Przep.wody nat.zas.str.3,P2",
          dataIndex: "i3"
        },
        {
          title: "Przep.wody nat.zas.str.4,P2",
          dataIndex: "i4"
        },
        {
          title: "Przep.wody nat.zas.str.5,P2",
          dataIndex: "i5"
        },
        {
          title: "Przep.wody nat.zas.str.6,P2",
          dataIndex: "i6"
        },
        {
          title: "Przep.wody nat.zas.str.7,P2",
          dataIndex: "i7"
        },
        {
          title: "Action",
          dataIndex: "action",
          render: (text, record) =>

                  <Popover
                      content={
                        <div style={{width: 500}}>
                        <p>Speed: {record.speed}</p>
                          <p>Przep.wody nat.zas.str.1,P2: AVG: {record.i1}, Min: {record.i1Min}, Max: {record.i1Max}</p>
                          <p>Przep.wody nat.zas.str.2,P2: AVG: {record.i2}, Min: {record.i2Min}, Max: {record.i2Max}</p>
                          <p>Przep.wody nat.zas.str.3,P2: AVG: {record.i3}, Min: {record.i3Min}, Max: {record.i3Max}</p>
                          <p>Przep.wody nat.zas.str.4,P2: AVG: {record.i4}, Min: {record.i4Min}, Max: {record.i4Max}</p>
                          <p>Przep.wody nat.zas.str.5,P2: AVG: {record.i5}, Min: {record.i5Min}, Max: {record.i5Max}</p>
                          <p>Przep.wody nat.zas.str.6,P2: AVG: {record.i6}, Min: {record.i6Min}, Max: {record.i6Max}</p>
                          <p>Przep.wody nat.zas.str.7,P2: AVG: {record.i7}, Min: {record.i7Min}, Max: {record.i7Max}</p>
                      </div>
                      }
                  >
                    <Icon
                        type="info-circle"
                        theme="filled"
                        style={{ fontSize: "20px" }}
                    />
                  </Popover>

        }
      ]
    };
  }

  handleSave = row => {
    const newData = [...this.state.rows];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };

  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };

  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  }

  fileHandler = fileList => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (false
      /*!(
        fileObj.type === "application/vnd.ms-excel" || fileObj.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )*/
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = []
        let labels = []
        let valuesToChart = []
        let f = []
        let values = new Set()
        resp.rows.map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: index,
              timeFrom: row[0],
              timeTo: row[0],
              speed: row[4] !== undefined ? Number(Math.round(row[4] * 10)/10).toFixed(2) : "",
              i1: row[32],
              i1Max: row[32],
              i1Min: row[32],
              i2: row[34],
              i2Min: row[34],
              i2Max: row[34],
              i3: row[36],
              i3Min: row[36],
              i3Max: row[36],
              i4: row[38],
              i4Min: row[38],
              i4Max: row[38],
              i5: row[40],
              i5Min: row[40],
              i5Max: row[40],
              i6: row[42],
              i6Min: row[42],
              i6Max: row[42],
              i7: row[44],
              i7Min: row[44],
              i7Max: row[44]
            });
          }
        });

        newRows.forEach((row,index)=>{
          let l = f.length -1;
          if(l !== -1) {
            if (Number(row.speed) === Number(f[l].speed)) {
              f[l].i1 = ((Number(row.i1) + Number(f[l].i1)) / 2 ).toFixed(3)
              f[l].i1Max = f[l].i1Max > row.i1 ? f[l].i1Max : row.i1;
              f[l].i1Min = f[l].i1Min < row.i1 ? f[l].i1Min : row.i1;
              f[l].i2 = ((Number(row.i2) + Number(f[l].i2)) / 2 ).toFixed(3)
              f[l].i2Max = f[l].i2Max > row.i2 ? f[l].i2Max : row.i2;
              f[l].i2Min = f[l].i2Min < row.i2 ? f[l].i2Min : row.i2;
              f[l].i3 = ((Number(row.i3) + Number(f[l].i3)) / 2 ).toFixed(3)
              f[l].i3Max = f[l].i3Max > row.i3 ? f[l].i3Max : row.i3;
              f[l].i3Min = f[l].i3Min < row.i3 ? f[l].i3Min : row.i3;
              f[l].i4 = ((Number(row.i4) + Number(f[l].i4)) / 2 ).toFixed(3)
              f[l].i4Max = f[l].i4Max > row.i4 ? f[l].i4Max : row.i4;
              f[l].i4Min = f[l].i4Min < row.i4 ? f[l].i4Min : row.i4;
              f[l].i5 = ((Number(row.i5) + Number(f[l].i5)) / 2 ).toFixed(3)
              f[l].i5Max = f[l].i5Max > row.i5 ? f[l].i5Max : row.i5;
              f[l].i5Min = f[l].i5Min < row.i5 ? f[l].i5Min : row.i5;
              f[l].i6 = ((Number(row.i6) + Number(f[l].i6)) / 2 ).toFixed(3)
              f[l].i6Max = f[l].i6Max > row.i6 ? f[l].i6Max : row.i6;
              f[l].i6Min = f[l].i6Min < row.i6 ? f[l].i6Min : row.i6;
              f[l].i7 = ((Number(row.i7) + Number(f[l].i7)) / 2 ).toFixed(3)
              f[l].i7Max = f[l].i7Max > row.i7 ? f[l].i7Max : row.i7;
              f[l].i7Min = f[l].i7Min < row.i7 ? f[l].i7Min : row.i7;
              f[l].timeTo = row.timeFrom
            } else {
              f.push(row)
              values.add(Number(row.speed).toFixed(2))
            }
          } else {
            row.timeTo = row.timeFrom;
            f.push(row)
            values.add(Number(row.speed).toFixed(2))
          }
        })

        f.forEach( row => {
          labels.push(row.timeFrom)
          valuesToChart.push(row.speed)
        })

        newRows = f;
        let values2 = []


        const iterator1 = values.entries();
        values2.push({ value: "", label: "ALL"})
        for (let entry of iterator1) {
          values2.push({ value: entry[0], label: entry[0]})
        }

       values2 = values2.sort((a, b) => {
          return a.value - b.value
        })


        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!"
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            sortedRows: newRows,
            values: values2,
            errorMessage: null,
            data:{
            labels: labels,
                datasets: [
              {
                label: "Speed",
                data: valuesToChart
              }
            ]
          }
          });
        }
      }
    });
    return false;
  };

  handleSubmit = async () => {
    console.log("submitting: ", this.state.rows);
    //submit to API
    //if successful, banigate and clear the data
    //this.setState({ rows: [] })
  };

  handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count,
      name: "User's name",
      age: "22",
      gender: "Female"
    };
    this.setState({
      rows: [newData, ...rows],
      count: count + 1
    });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <>
        <div style={{
          paddingRight: 20,
          paddingLeft: 20
        }}>
          <div style={{paddingBottom: 25, paddingTop: 25, paddingLeft:10}}>
            <Upload
                name="file"
                beforeUpload={this.fileHandler}
                onRemove={() => this.setState({ rows: [] })}
                multiple={false}
            >
              <Button>
                <Icon type="upload" /> Click to Upload Excel File
              </Button>


            </Upload>
          </div>
          <div >
            <Line
                options={{responisive:true}}
                data = {this.state.data}
            />
          </div>


        <Row gutter={16}>
          <Col
            span={8}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%"
            }}
          >
          </Col>
          <Col span={8}>
          </Col>
          <Col
            span={8}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <>


              </>
            )}
          </Col>
        </Row>

        <div style={{
          width: 207,
          paddingTop: 10
        }}>
          <Select onChange={ selected => {
            const rows = [...this.state.rows];

            this.setState({sortedRows: rows.filter(row =>
                  row.speed == selected.value || selected.value === ""
              )})

            let labels = []
            let values = []
            this.state.sortedRows.forEach(row => {
              labels.push(row.dateFrom)
              values.push(row.speed)
            })
            this.setState({data:{
                  datasets: [
                {
                  label: "Speed",
                  data: this.state.data.datasets[0].data,
                  backgroundColor: function(context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value == selected.value || selected.value === "" ? 'red' : "";
                  }
                }
              ]
            }})
          }
          } options={this.state.values}/>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            dataSource={this.state.sortedRows}
            columns={columns}
          />
        </div>
        </div>
      </>
    );
  }
}
