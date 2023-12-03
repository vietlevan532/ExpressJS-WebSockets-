function getCookie(name) {
    let match = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return match ? decodeURIComponent(match[1]) : undefined;
}

var user = JSON.parse(getCookie('user'));
console.log('Cookie Data', user);

var sender = user._id;
var receiver;
var socket = io('/user-namespace', {
    auth: {
        token: user._id
    }
});

$(document).ready(function () {
    // Ẩn chat area và user detail ban đầu
    $("#chat-area").hide();
    $("#user-detail").hide();

    // Xử lý sự kiện khi người dùng nhấp vào thẻ a trong phần user
    $("a.user-link").click(function () {

        var userId = $(this).attr('data-id');
        receiver = userId;

        var $media = $(this).find('.media');

        $(".user-link .media").removeClass('bg-light p-2').addClass('mt-1 p-2');

        // Loại bỏ class cũ và thêm class mới cho phần tử liên kết được click
        $(this).find('.media').removeClass('mt-1 p-2').addClass('bg-light p-2');


        $("#chat-area").show();
        $("#user-detail").show();
        $("#welcome-content").hide();

        socket.emit('existConversation', { sender: sender, receiver: receiver })

    });
});

//update user online status
socket.on('getOnlineUser', function(data) {
    $('#' + data.user_id + '-status').text('');
    $('#' + data.user_id + '-status').removeClass('offline-status');
    $('#' + data.user_id + '-status').addClass('online-status');
});

socket.on('getOfflineUser', function(data) {
    $('#' + data.user_id + '-status').text('');
    $('#' + data.user_id + '-status').addClass('offline-status');
    $('#' + data.user_id + '-status').removeClass('online-status');
});

//save message of user
$('#chat-form').submit(function(event) {
    event.preventDefault();
    var message = $('#message').val();
    $.ajax({
        url: '/conversations/save-message',
        type: 'POST',
        data: { sender: sender, receiver: receiver, message:message },
        success: function(response) {
            if (response.success) {
                console.log(response);
                console.log(response.data.message);
                $('#message').val('');
                let conversation = response.data.message;
                let html = `
                    <li class="clearfix odd" id="`+ response.data._id +`">
                        <div class="chat-avatar">
                            <img src="`+ user.avatar +`" alt="`+ user.name +`" class="rounded" />
                            <i></i>
                        </div>
                        <div class="conversation-text">
                            <div class="ctext-wrap">
                                <i>`+ user.name +`</i>
                                <p>
                                    `+ conversation +`
                                </p>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown">
                            <button class="btn btn-sm btn-link" data-toggle="dropdown"
                                aria-expanded="false"><i class='uil uil-ellipsis-v'></i></button>

                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="javascript:void(0);">Copy Message</a>
                                <a class="dropdown-item edit-message" href="javascript:void(0);" data-id="`+ response.data._id +`" data-msg="`+ conversation +`" data-toggle="modal" data-target="#editChatModal">Edit</a>
                                <a class="dropdown-item remove-message" href="javascript:void(0);" data-id="`+ response.data._id +`" data-toggle="modal" data-target="#deleteChatModal">Remove</a>
                            </div>
                        </div>
                    </li>
                `;
                $('#chat-container').append(html);
                socket.emit('newMessage', response.data);
                $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
            } else {
                alert(data.msg);
            }
        }
    });
});

// load new message of receiver
socket.on('loadNewMessage', function(data) {
    console.log(data);
    if (sender == data.receiver && receiver == data.sender) {
        let html = `
            <li class="clearfix" id="`+ data._id +`">
                <div class="chat-avatar">
                </div>
                <div class="conversation-text">
                    <div class="ctext-wrap">
                        <p>
                            `+ data.message +`
                        </p>
                    </div>
                </div>
                <div class="conversation-actions dropdown">
                    <button class="btn btn-sm btn-link" data-toggle="dropdown"
                        aria-expanded="false"><i class='uil uil-ellipsis-v'></i></button>

                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="javascript:void(0);">Copy Message</a>
                        <a class="dropdown-item edit-message" href="javascript:void(0);">Edit</a>
                        <a class="dropdown-item remove-message" href="javascript:void(0);">Remove</a>
                    </div>
                </div>
            </li>
        `;
        $('#chat-container').append(html);
        $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
    }
});

// load old conversation data
socket.on('loadConversations', function(data) {
    $('#chat-container').html('');

    var conversations = data.conversations;
    var receiver = data.receiver;
    let html = '';
    for(let i = 0; i < conversations.length; i++) {
        let addClass = '';
        let addClassDropMenu = '';
        let avatar;
        let name;
        if (conversations[i]['sender'] == sender) {
            addClass = 'clearfix odd';
            addClassDropMenu = 'dropdown-menu-right';
            avatar = user.avatar;
            name = user.name;
        } else {
            addClass = 'clearfix';
            addClassDropMenu = 'dropdown-menu-left';
            avatar = receiver.avatar;
            name = receiver.name;
        }
        // 
        html += `
            <li class="`+ addClass +`" id="`+conversations[i]['_id']+`">
                <div class="chat-avatar">
                    <img src="`+ avatar +`" alt="`+ name +`" class="rounded" />
                    <i></i>
                </div>
                <div class="conversation-text">
                    <div class="ctext-wrap">
                        <i>`+ name +`</i>
                        <p>
                            `+ conversations[i]['message'] +`
                        </p>
                    </div>
                </div>`;
        if (conversations[i]['sender'] == sender) {
            html += `
                <div class="conversation-actions dropdown">
                    <button class="btn btn-sm btn-link" data-toggle="dropdown"
                        aria-expanded="false"><i class='uil uil-ellipsis-v'></i></button>

                    <div class="dropdown-menu `+addClassDropMenu+`">
                        <a class="dropdown-item" href="javascript:void(0);">Copy Message</a>
                        <a class="dropdown-item edit-message" href="javascript:void(0);" data-id="`+ conversations[i]['_id'] +`" data-msg="`+ conversations[i]['message'] +`" data-toggle="modal" data-target="#editChatModal">Edit</a>
                        <a class="dropdown-item remove-message" href="javascript:void(0);" data-id="`+ conversations[i]['_id'] +`" data-toggle="modal" data-target="#deleteChatModal">Remove</a>
                    </div>
                </div>
            `;
        }
        html += `
            </li>
        `;
    }
    $('#chat-container').append(html);
    $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
});


// Delete message
$(document).on('click', '.remove-message', function() {
    let msg = $(this).closest('.conversation-text').find('.ctext-wrap p').text();
    $('#delete-message').text(msg);
    $('#delete-message-id').val($(this).attr('data-id'));
})

$('#delete-chat-form').submit(function(event){
    event.preventDefault();
    var id = $('#delete-message-id').val();
    $.ajax({
        url: '/conversations/delete-message',
        type: 'DELETE',
        data: { id:id },
        success: function(res) {
            if (res.success == true) {
                $('#' + id).remove();
                $('#deleteChatModal').modal('hide');
                socket.emit('messageDeleted', id);
            } else {
                alert(res.msg);
            }
        }
    });
});

socket.on('chatMessageDeleted', function(id) {
    $('#' + id).remove();
});

// Update message 
$(document).on('click', '.edit-message', function() {
    $('#edit-message-id').val($(this).attr('data-id'));
    $('#update-message').val($(this).attr('data-msg'));
});

$('#update-chat-form').submit(function(event){
    event.preventDefault();
    var id = $('#edit-message-id').val();
    var msg = $('#update-message').val();
    $.ajax({
        url: '/conversations/update-message',
        type: 'POST',
        data: { id:id },
        success: function(res) {
            if (res.success == true) {
                $('#editChatModal').modal('hide');
                $('#' + id).find('p').text(msg);
                $('#' + id).find('.edit-message').attr('data-msg', msg);
                socket.emit('messageUpdated', { id: id, message: msg });
            } else {
                alert(res.msg);
            }
        }
    });
});

socket.on('chatMessageUpdated', function(data) {
    $('#' + data.id).find('p').text(data.message);
});

// add members
$('.addMember').click(function() {
    var id = $(this).attr('data-id');
    var limit = $(this).attr('data-limit');

    $('#group_id').val(id);
    $('#limit').val(limit);

    $.ajax({
        url: '/get-members',
        type: 'POST',
        data: { group_id: id },
        success: function(res) {
            if(res.success == true) {
                let users = res.data;
                let html = '';
                for(i = 0; i < users.length; i++) {
                    let isMemberOfGroup = users[i]['members'].length > 0 ? true : false;
                    html+= `
                        <tr class="w-100">
                            <td>
                                <input type="checkbox" `+ (isMemberOfGroup ? 'checked' : '' )+` name="members[]" value="`+ users[i]['_id'] +`"/>
                            </td>
                            <td>
                                <img src="`+ users[i]['avatar'] +`" style="margin-left:50px; width: 40px; height: 40px; border-radius: 50%;" alt="">
                            </td>
                            <td>
                                <p>`+ users[i]['name'] +`</p>
                            </td>
                        </tr>
                    `;
                }
                $('.addMemberInTable').html(html);
            } else {
                alert(res.msg);
            }
        }
    });
})

// add member form submit
$('#add-member-form').submit(function(event) {
    event.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        url: '/add-members',
        type: 'POST',
        data: formData,
        success: function(res) {
            if(res.success) {
                alert(res.msg);
                $('#memberModal').modal('hide');
                $('#add-member-form')[0].reset();
                alert(res.msg);
            } else {
                $('#add-member-error').text(res.msg);
                setTimeout(() => {
                    $('#add-member-error').text('');
                }, 3000);
            }
        }
    });
});
    
