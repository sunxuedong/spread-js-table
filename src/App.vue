<template>
  <SpreadJSTable
    :columns="columns" :data="data" :wordWrap="true"
  />
</template>

<script>
  import GC from '@grapecity/spread-sheets';
  import globalVariable from '@/utils/globalVariable'

  import SpreadJSTable from './components/SpreadJSTable'

  export default {
    components: {
      SpreadJSTable
    },
    data() {
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

<style>

</style>
