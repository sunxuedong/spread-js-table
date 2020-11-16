# SpreadJsTable
> 一个基于葡萄城SpreadJS的表格组件

SpreadJsTable依赖使用的SpreadJS版本是13.0.0

对于非SpreadJS 13.0.0的版本，目前没有做兼容。

## 安装
### npm 安装
```shell
npm install spread-js-table -S
```

### script 引入
```shell
<script src="http://sunxuedong.gitee.io/spread-js-table/dist/spread-js-table.js"></script>
```

## 快速开始
### 使用 npm
<details>
  <summary>查看代码</summary>
  <h4>main.js</h4>
  <pre><code>
    import Vue from 'vue'
    import GC from '@grapecity/spread-sheets'
    import '@grapecity/spread-sheets-vue';
    import '@grapecity/spread-sheets-charts';
    import '@grapecity/spread-sheets/styles/gc.spread.sheets.css';
    import '@grapecity/spread-sheets-resources-zh';
    import ExcelIO from '@grapecity/spread-excelio';
    import SpreadJSTable from 'spread-js-table';
    GC.Spread.Common.CultureManager.culture('zh-cn');
    Vue.use(SpreadJSTable, {
      GC,
      ExcelIO
    });
  </pre></code>

  <h4>demo.vue</h4>
  <pre><code>
    &lt;template&gt;
      &lt;spread-js-table :columns="columns" :data="data"&gt;
      &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
    					{name: "date", displayName: "日期", size: 100},
    					{name: "name", displayName: "姓名", size: 100},
    					{name: "address", displayName: "地址", size: 150}
    				],
    				data: [
    					{
                            date: '2016-05-02',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1518 弄'
                        },
                        {
                            date: '2016-05-04',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1517 弄'
                        },
                        {
                            date: '2016-05-01',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄'
                        },
                        {
                            date: '2016-05-03',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        }
    				]
    			}
    		}
    	}
    </script>
  </code></pre>
</details>

### 使用 script 引入
<details>
  <summary>查看代码</summary>
  <pre><code>
  &lt;!DOCTYPE html&gt;
    &lt;html&gt;
        <head>
        	<title>test2</title>
        	&lt;link rel="stylesheet" href="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets/gc.spread.sheets.css"&gt;
        	<style></style>
        		html, body, #app {
        			height: 100%;
        		}
        	</style>
        </head>
        &lt;body&gt;
        	&lt;div id="app"&gt;
        		&lt;spread-js-table :data="data" :columns="columns"&gt;&lt;/spread-js-table&gt;
        	&lt;/div>
        	<script src="http://sunxuedong.gitee.io/library/vue/2.5.2/vue.min.js"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets/gc.spread.sheets.all.min.js" charset="utf-8" type="text/javascript"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-excelio/gc.spread.excelio.min.js" charset="utf-8"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets-charts/gc.spread.sheets.charts.min.js" charset="utf-8"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets-print/gc.spread.sheets.print.min.js" charset="utf-8"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets-resources-zh/gc.spread.sheets.resources.zh.min.js" charset="utf-8"></script>
        	<script src="http://sunxuedong.gitee.io/library/grapecity/spread-js/13.0.0/spread-sheets-vue/gc.spread.sheets.vue.js" charset="utf-8"></script>
        	<script src="http://sunxuedong.gitee.io/spread-js-table/dist/spread-js-table.js" charset="utf-8"></script>
        	<script>
        		var app = new Vue({
        			el: '#app',
        			data: {
        				columns: [
        					{name: "date", displayName: "日期", size: 100},
        					{name: "name", displayName: "姓名", size: 70},
        					{name: "address", displayName: "地址", size: 200}
        				],
        				data: [
        					{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
        					},
        					{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
        					},
        					{
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
        					},
        					{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                  }
        				]
        			}
        		})
        	</script>
        &lt;/body&gt;
    &lt;/html&gt;
  </pre></code>
</details>

## SpreadJsTable 表格
### 基础表格
基础的表格展示用法。

![基础表格](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/基础表格.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
    					{name: "date", displayName: "日期", size: 100},
    					{name: "name", displayName: "姓名", size: 100},
    					{name: "address", displayName: "地址", size: 150}
    				],
    				data: [
    					{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
              },
              {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
              },
              {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
              }
    				]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

### 带斑马纹表格
使用带斑马纹的表格，可以更容易区分出不同行的数据。

![带斑马纹表格](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/带斑马纹表格.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"
            oddRowBackColor="red" evenRowBackColor="green"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template>
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
    					{name: "date", displayName: "日期", size: 100},
    					{name: "name", displayName: "姓名", size: 100},
    					{name: "address", displayName: "地址", size: 150}
    				],
    				data: [
    					{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
              },
              {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
              },
              {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
              }
    				]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

### 带状态表格
可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。

![带状态表格](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/带状态表格.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"
             @render-row="renderRow"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
    					{name: "date", displayName: "日期", size: 100},
    					{name: "name", displayName: "姓名", size: 100},
    					{name: "address", displayName: "地址", size: 150}
    				],
    				data: [
    					{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
              },
              {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
              },
              {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
              }
    				]
    			}
    		},
            methods: {
              renderRow ({rowIdx, rowData, style}) {
                if (rowData.date === '2016-05-02') {
                  style.backColor = 'skyblue'
                  style.foreColor = '#fff'
                }
              }
            }
    	}
    </script>
  </pre></code>
</details>

### 固定列
横向内容过多时，可选择固定列，frozenColumnNum决定固定的列数，frozenTrailingColumnNum决定固定尾列的列数。

![固定列](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/固定列.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data" @render-cell="renderCell"
            @button-click="buttonClick" :frozenColumnNum="1" :frozenTrailingColumnNum="1"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
    					{name: "date", displayName: "日期", size: 100},
    					{name: "name", displayName: "姓名", size: 100},
    					{name: "address", displayName: "地址", size: 150}
    				],
    				data: [
    					{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
              },
              {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
              },
              {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
              }
    				]
    			}
    		},
            methods: {
              renderCell({ column, style }) {
                if (column.displayName === '操作') {
                  style.foreColor = '#409EFF';
                }
              },
              buttonClick (...args) {
                console.log(args)
              }
            }
    	}
    </script>
  </pre></code>
</details>

### 多级表头
数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。

![多级表头](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/多级表头.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
	    export default {
    		data () {
    			return {
    				columns: [
              {name: "date", displayName: "日期", size: 100},
              {
                displayName: '配送信息',
                children: [
                  {
                    name: 'name',
                    displayName: '姓名'
                  },
                  {
                    name: 'address',
                    displayName: '地址',
                    children: [
                      {name: "province", displayName: "省份", size: 100},
                      {name: "city", displayName: "市区", size: 100},
                      {name: "address", displayName: "地址", size: 200},
                      {name: "zip", displayName: "邮编", size: 100}
                    ]
                  }
                ]
              }
            ],
    				data: [
              {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              },
              {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1517 弄',
                zip: 200333
              },
              {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1519 弄',
                zip: 200333
              },
              {
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1516 弄',
                zip: 200333
              }
            ]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

### 单选
选择单行数据时使用 Checkbox。

![单选](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/单选.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
      import GC from '@grapecity/spread-sheets';
	    export default {
    		data () {
    			return {
    				columns: [
              {
                name: '',
                displayName: '选择',
                type: 'radio',
                size: 50,
                cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
                isProtect: false,
                isFilterable: false
              },
              {name: "date", displayName: "日期", size: 100},
              {name: "name", displayName: "姓名", size: 100},
              {name: "province", displayName: "省份", size: 100},
              {name: "city", displayName: "市区", size: 100},
              {name: "address", displayName: "地址", size: 200},
              {name: "zip", displayName: "邮编", size: 100}
            ],
    				data: [
              {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              },
              {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1517 弄',
                zip: 200333
              },
              {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1519 弄',
                zip: 200333
              },
              {
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1516 弄',
                zip: 200333
              }
            ]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

### 全选
选择多行数据时使用 Checkbox。

![全选](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/全选.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
      import GC from '@grapecity/spread-sheets';
	    export default {
    		data () {
    			return {
    				columns: [
              {
                name: '',
                displayName: '全选',
                size: 50,
                cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
                isProtect: false,
                isFilterable: false
              },
              {name: "date", displayName: "日期", size: 100},
              {name: "name", displayName: "姓名", size: 100},
              {name: "province", displayName: "省份", size: 100},
              {name: "city", displayName: "市区", size: 100},
              {name: "address", displayName: "地址", size: 200},
              {name: "zip", displayName: "邮编", size: 100}
            ],
    				data: [
              {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              },
              {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1517 弄',
                zip: 200333
              },
              {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1519 弄',
                zip: 200333
              },
              {
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1516 弄',
                zip: 200333
              }
            ]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

### 排序 & 筛选（spreadJS 本身具有的功能）

### 表尾合计行
若表格展示的是各类数字，可以在表尾显示各列的合计，可以通过isNeedGather的bool值来决定是否汇总。

![表尾合计行](http://sunxuedong.gitee.io/static-resources/img/spread-js-table/表尾合计行.png)
<details>
  <summary>查看代码</summary>
  <pre><code>
    &lt;template&gt;&lt;/template&gt;
        &lt;spread-js-table :columns="columns" :data="data"&gt;&lt;/spread-js-table&gt;
        &lt;/spread-js-table&gt;
    &lt;/template&gt;
  </code></pre>
  <pre><code>
    <script>
      import GC from '@grapecity/spread-sheets';
	    export default {
    		data () {
    			return {
    				columns: [
              {name: "name", displayName: "姓名", size: 100},
              {name: "amount1", displayName: "数值 1", size: 100, isNeedGather: true},
              {name: "amount2", displayName: "数值 2", size: 100, isNeedGather: true},
              {name: "amount3", displayName: "数值 3", size: 200, isNeedGather: true}
            ],
    				data: [
              {
                id: '12987122',
                name: '王小虎',
                amount1: 234,
                amount2: 3.2,
                amount3: 10
              },
              {
                id: '12987123',
                name: '王小虎',
                amount1: 165,
                amount2: 4.43,
                amount3: 12
              },
              {
                id: '12987124',
                name: '王小虎',
                amount1: 324,
                amount2: 1.9,
                amount3: 9
              },
              {
                id: '12987125',
                name: '王小虎',
                amount1: 621,
                amount2: 2.2,
                amount3: 17
              },
              {
                id: '12987126',
                name: '王小虎',
                amount1: 539,
                amount2: 4.1,
                amount3: 15
              }
            ]
    			}
    		}
    	}
    </script>
  </pre></code>
</details>

## SpreadJsTable Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| :---- | :---- | :---- | :---- | :---- |
| data | 显示的数据 | array | — | — |
| columns | 列头 | array | — | — |
| isShowFilteredNumber | 是否显示使用spreadJS过滤后，过滤的数量 | array | — | — |
| oddRowBackColor | 奇数行的背景色 | string | — | #dcdcdc |
| evenRowBackColor | 偶数行的背景色 | string | — | #ffffff |
| frozenColumnNum | 固定表格列的数量，从左边开始 | number | — | 0 |
| frozenTrailingColumnNum | 固定表格列的数量，从左边开始 | number | — | 0 |

## SpreadJsTable Events
| 事件名 | 说明 | 参数 |
| :---- | :---- | :---- |
| selection-change | 当选择项发生变化时会触发该事件 | selection |
| cell-mouse-enter | 当单元格 hover 进入时会触发该事件 | array  | row, column, hitinfo |
| cell-mouse-leave | 当单元格 hover 退出时会触发该事件 | row, column, hitinfo |
| header-cell-mouse-center | 当列头单元格 hover 进入时会触发该事件 | column, hitinfo |
| header-cell-mouse-leave | 列头 | 当列头单元格 hover 退出时会触发该事件 | column, hitinfo |
| cell-db-click | 当某一单元格被双击时会触发该事件 | row, column |
| row-db-click | 当某一行被双击时会触发该事件 | row, column |
| button-click | 当点击单元格button时会触发该事件 | {row, column, text} |
| render-row | 当处理表格的每行数据时会触发该事件（可以通过对style对象的属性赋值，达到更改行样式的目的） | {rowIdx, rowData, style} |
| render-cell | 当渲染单元格时会触发该事件（可以通过对style对象的属性赋值，达到更改单元格样式的目的） | {rowIdx, colIdx, column, style} |
| render-header | 当渲染列头时会触发该事件（可以通过对style对象的属性赋值，达到更改列头单元格样式的目的） | {style, column, colIdx, rowIdx} |

## SpreadJsTable Methods
| 方法名 | 说明 | 参数 |
| :---- | :---- | :---- |
| refresh | 刷新sheet | — |
| clearTableCheckStatus | 清空表格的选中状态 | — |
| exporting | 导出 | {name:'', data: []} // name:导出文件的名称 data: 导出的数据，默认当前页数据 |

## SpreadTable-column Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| :---- | :---- | :---- | :---- | :---- |
| type | 对应列的类型 | string | radio/checkbox | — |
| name | column 的 key | string | — | — |
| displayName | 显示的标题 | string | — | — |
| cellType | 单元格的类型 | object | — | — |
| isProtect | 该列是否开启表单保护 | boolean | — | true |
| isFilterable | 该列是否有过滤功能 | boolean | — | true |
| isNeedGather | 该列是否有汇总功能 | boolean | — | false |
| isVisible | 该列是否可见 | boolean | — | true |
| children | 多表头的key | boolean | — | — |
| wordWrap | 是否允许换行，值为true时，可通过‘\r\n’给文字换行 | boolean | — | false |
