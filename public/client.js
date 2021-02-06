$(document).ready(function () {
  let items = []
  let itemsRaw = []

  $.getJSON('/api/books', function (data) {
    //let  items = [];
    itemsRaw = data
    $.each(data, function (i, val) {
      if (val.title == undefined) {
        val.title == 'Unknown Title'
      }
      if (val.writer == undefined) {
        val.writer == 'Unknown Writer'
      }
      items.push(
        '<li class="bookItem" id="' +
          i +
          '">' +
          '<p id="booktitle">' +
          Number(i + 1) +
          '. [' +
          val.title +
          '] by ' +
          val.writer +
          '</p>' +
          '</li>'
      )
      return i !== 14
    })
    if (items.length >= 15) {
      items.push('<p>...and ' + (data.length - 15) + ' more!</p>')
    }
    $('<ul/>', {
      class: 'listWrapper',
      html: items.join('')
    }).appendTo('#display')
  })

  let comments = []
  $('#display').on('click', 'li.bookItem', function () {
    $('#detailTitle').html(
      '<b>' +
        itemsRaw[this.id].title +
        '</b> (Book id: ' +
        itemsRaw[this.id]._id +
        ')'
    )
    $.getJSON('/api/books/' + itemsRaw[this.id]._id, function (data) {
      comments = []
      $.each(data.comments, function (i, val) {
        comments.push('<li>' + val + '</li>')
      })
      comments.push(
        '<br><form id="newCommentForm"><textarea style="width:200px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></textarea></form>'
      )
      comments.push(
        '<br><button class="btn btn-outline-info addComment" id="' +
          data._id +
          '">Add Comment</button>'
      )
      comments.push(
        '<button class="btn btn-outline-danger deleteBook" id="' +
          data._id +
          '">Delete Book</button>'
      )
      $('#detailComments').html(comments.join(''))
    })
  })

  $('#bookDetail').on('click', 'button.deleteBook', function () {
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'delete',
      success: function (data) {
        //update list
        $('#detailComments').html(
          '<p style="color: red;">' + data + '<p><p>Refresh the page</p>'
        )
      }
    })
  })

  $('#bookDetail').on('click', 'button.addComment', function () {
    let newComment = $('#commentToAdd').val()
    if (!newComment) {
      window.alert('comment section is empty')
    } else {
      $.ajax({
        url: '/api/books/' + this.id,
        type: 'post',
        dataType: 'json',
        data: $('#newCommentForm').serialize(),
        success: function (data) {
          comments.unshift(newComment) //adds new comment to top of list
          $('#detailComments').html(comments.join(''))
        }
      })
    }
  })

  $('#newBook').click(function () {
    let newBookTitle = $('#bookTitleToAdd').val()
    let newBookWriter = $('#bookWriterToAdd').val()
    if (!newBookTitle || !newBookWriter) {
      window.alert('Book information is missing')
    } else {
      $.ajax({
        url: '/api/books',
        type: 'post',
        dataType: 'json',
        data: $('#newBookForm').serialize(),
        success: function (data) {
          //update list
        }
      })
    }
  })

  $('#deleteAllBooks').click(function () {
    const confirmDelete = window.confirm('Do you want to delete all book list?')
    if (confirmDelete) {
      $.ajax({
        url: '/api/books',
        type: 'delete',
        dataType: 'json',
        data: $('#newBookForm').serialize(),
        success: function (data) {
          //update list
        }
      }).then(window.location.reload())
    } else {
      return
    }
  })
})
