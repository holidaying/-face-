/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

$(function() {
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: $('#uptoken_url').val(),
        domain: $('#domain').val(),
        get_new_uptoken: false,

        auto_start: true,
        log_level: 5,
        multi_selection: false,
        filters: {
            max_file_size: '100mb',
            prevent_duplicates: true,
            mime_types: [
                { title: "Image files", extensions: "jpg,gif,jpeg,png" }, // 限定jpg,gif,png后缀上传
            ]
        },
        init: {
            'BeforeChunkUpload': function(up, file) {
                console.log("before chunk upload:", file.name);
            },
            'FilesAdded': function(up, files) {
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                console.log("this is a beforeupload function from init");
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                ajaxDetect(up, info);

            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            },

        },

    });
    var labelMatch = {
        age: function(data) {

        },
        headpose: function(data) {

        },
        smile: function(data) {

        },
        dark_glasses: function() {

        }

    };

    function ajaxDetect(up, info) {
        var domain = up.getOption('domain');
        var res = $.parseJSON(info.response);
        url = domain + encodeURI(res.key);
        $(".container-upload").css("background-image", "url(" + url + ")");
        $.ajax({
            url: 'https://api-cn.faceplusplus.com/facepp/v3/detect', // Different bucket zone has different upload url, you can get right url by the browser error massage when uploading a file with wrong upload url.
            type: 'POST',
            data: {
                api_key: "mqdU3lmhlIG7xjcT7c4MWpeM3k1OVss_",
                api_secret: "604swKAzQLDukYf6Bq_Unnef2Tn5UYoA",
                return_landmark: 0,
                image_url: url,
                return_attributes: "gender,age,smiling,headpose,facequality,blur,eyestatus,ethnicity"
            },
            dataType: "json",
            success: function(res) {

                var resData = res.faces[0].attributes;
                $(".man-sex").text(resData.gender.value)
                $(".man-age").text(resData.age.value)
                $(".man-smile").text(resData.smile.value)
                    // $(".man-left-eye").text(resData.eyestatus.left_eye_status.value)
                    // $(".man-right-eye").text(resData.eyestatus.right_eye_status.value)
                $(".man-contry").text(resData.age.ethnicity)
                $(".specil-get-box").css("opacity", "1");
            },
            error: function(res) {

            }
        });
    }
    uploader.bind('BeforeUpload', function() {
        console.log("hello man, i am going to upload a file");
    });
    uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
    })

});
