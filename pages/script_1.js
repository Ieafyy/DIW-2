$(document).ready(function(){
    
params = new URLSearchParams(window.location.search)
id = params.get('id')
console.log(id)

$.ajax({
    url: 'https://diwserver.vps.webdock.cloud/products/' + id,
    method: 'GET',
    success: (e) => {
        console.log(e)
        $('#foto').attr('src', e['image'])
        $('#titulo').text(e['title'])
        $('#preco').text("R$"+((e['price']).toFixed(2)).toString().replace('.',','))
        $('#desc').html(e['description'])
        document.title = e['title']
    },
    error: (e) => {
        console.log(e)
    }
})

$('#seta').click(() => {
    window.location.href = '../index.html'
})



})
