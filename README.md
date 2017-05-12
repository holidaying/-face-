## 访问地址:http://119.29.201.214:19110/
步骤:

* 1.七牛云账号注册
```
修改地址
module.exports = {
    'ACCESS_KEY': 'KSGgP2qwWt34dBmvTDbThdPWv4q0Jh6jtHNk92Jq',  // https://portal.qiniu.com/user/key
    'SECRET_KEY': '',
    'Bucket_Name': '',
    'Port': 19110,
    'Uptoken_Url': 'uptoken',
    'Domain': '' // bucket domain eg:http://qiniu-plupload.qiniudn.com/
};
注意记得域名加http
```
* 2.face++人脸识别接口
```
$.ajax({
            url: 'https://api-cn.faceplusplus.com/facepp/v3/detect', // Different bucket zone has different upload url, you can get right url by the browser error massage when uploading a file with wrong upload url.
            type: 'POST',
            data: {
                api_key: "",//face++api_key
                api_secret: "",//face++api_secret
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
```
* 3.部署云主机
购买腾讯云主机
部署代码
npm install
npm start
访问地址：http://119.29.201.214:19110/