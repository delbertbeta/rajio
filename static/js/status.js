const data = JSON.parse(document.getElementById('data').textContent)

let nodes = ['fileCount', 'downloadCount', 'diskText', 'diskGraph', 'chart']

nodes = getElement(nodes)

function getElement(list) {
  const obj = {}
  list.forEach(v => {
    obj[v] = document.getElementById(v)
  })
  return obj
}

nodes.fileCount.textContent = data.totalCount
nodes.downloadCount.textContent = data.downloadCount
diskGraph.style.width = (data.usage.total - data.usage.available) / data.usage.total * 100 + '%'
nodes.diskText.textContent = filesize(data.usage.available) + '/' + filesize(data.usage.total)

option = {
  title: {
    text: 'DOWNLOADS PER DAY',
    x:'center',
    top: 6,
    textStyle: {
      fontWeight: 200,
      fontSize: 24
    }
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      textStyle: {
        color: '#353535'
      }
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      textStyle: {
        color: '#353535'
      }
    }
  },
  series: [{
    data: data.recent.map(v => [v.date, v.count]),
    type: 'bar',
    barMaxWidth: 32,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ]
        )
      }
    },
    tooltip: {
      show: true
    }
  }]
}

const chart = echarts.init(nodes.chart)

chart.setOption(option)