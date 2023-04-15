<script src="../../utils/validate.js"></script>
<template>
  <div class="login_page">
    <div class="login_box">
      <div class="center_box">
        <!-- 登录&注册-->
        <div :class="{login_form: true, rotate: tab === 2}">
          <div :class="{tabs: true, r180: reverse === 2}">
            <div class="fl tab" @click="changetab(1)">
              <span :class="{on: tab === 1}">登录</span>
            </div>
            <div class="fl tab" @click="changetab(2)">
              <span :class="{on: tab === 2}">注册</span>
            </div>
          </div>
          
          <!-- 登录 -->
          <div class="form_body" v-if="reverse === 1">
            <!-- submit.prevent 阻止默认表单事件提交，采用loginSubmit -->
            <form @submit.prevent="loginSubmit">
              <input type="text" v-model="loginData.username" placeholder="请输入用户名" autocomplete="off">
              <input type="password" v-model="loginData.password" placeholder="请输入密码" autocomplete="off">
              <div class="error_msg">{{loginMessage}}</div>
              <input type="submit" v-if="subState" disabled="disabled" value="登录中···" class="btn" />
              <input type="submit" v-else value="登录" @submit="loginSubmit" class="btn" />
            </form>
            <span>还没有账号？<a style="color: #005cc5" @click="changetab(2)">点击注册</a></span>
            <!--<el-button type="info" @click="testbutton"  round>测试按钮</el-button>-->
          </div>

          <!-- 注册 -->
          <div class="form_body r180" v-if="reverse === 2">
            <form @submit.prevent="regSubmit">
              <input type="text" v-model="registerData.username" placeholder="请输入用户名" autocomplete="off">
              <input type="password" v-model="registerData.password" placeholder="6-30位密码，可用数字/字母/符号组合" autocomplete="off">
              <input type="password" v-model="registerData.repPassword" placeholder="确认密码" >
              <div class="error_msg">{{regMessage}}</div>
              <div class="agree">
                <input type="checkbox" id="tonyi" v-model="registerData.check">
                <label for="tonyi">我已经阅读并同意</label><a href="jvascript:;"  @click="xieyi = true">《用户协议》</a>
              </div>
              <input type="submit" v-if="subState" disabled="disabled" value="提交中···" class="btn">
              <input type="submit" v-else value="注册" class="btn">
            </form>
          </div>
        </div>
      </div>
    </div>

    <Test v-if="testVisible" ref="testRef" @backchilddata="backchilddata" ></Test>

    <!-- 用户协议 -->
    <div class="xieyi" v-if="xieyi" @click.self="xieyi = false">
      <div class="xieyi_content">
        <div class="xieyi_title">请认真阅读用户协议</div>
        <div class="xieyi_body" v-if="xieyiContent" v-html="xieyiContent">
        </div>
        <input type="button" class="xieyi_btn" value="确定" @click="xieyi = false">
      </div>
    </div>
  </div>
</template>
<script >
  import {isvalidUsername} from '@/utils/validate';
  import {getxieyi, checkUsernameRegister, register} from '@/api/auth';
  import {state,
    mutations,
    actions,} from '@/store/modules/auth';

  import Test from '@/views/test/test';

export default {
    components: {
      Test
    },
    data () {
      return {
        testVisible : false,
        tab:  1, // 高亮当前标签名
        reverse:  1, // 旋转 1 登录，2 注册
        loginMessage: '', //登录错误提示信息
        regMessage: '', //注册错误提示信息
        subState: false, //提交状态
        xieyi: false, // 显示隐藏协议内容
        xieyiContent: null, // 协议内容
        redirectURL: 'http://blog.weiliwang.top', // 登录成功后重写向地址
        loginData: { // 登录表单数据
            username: '',
            password: ''
        },
        registerData: { // 注册表单数据
            username: '',
            password: '',
            //password1: '',
            repPassword: '',
            check: false
        },
      }
    },
    async created() {
      if(this.$route.query.redirectURL) { //如果有浏览器给出了重定向地址，那么赋值
        this.redirectURL = this.$route.query.redirectURL;
      }
      //获取协议内容
      this.xieyiContent = await getxieyi();

    },
    methods: {
      backchilddata(item) {
        debugger;
        console.log("父组件接收子组件回传的数据：", item);
        this.$message.success("成功接收子组件数据！" + item.user + item.region);
      },
      testbutton () {
        this.testVisible = true;
        this.$nextTick(() => {
          const item = {
            name : "小王",
            age : 26,
            address : "重庆"
          }
          this.$refs.testRef.init(item);
        })
      },
      // 切换标签
      changetab (int) {
          this.tab = int;
          let _that = this;
          setTimeout(() => {
            this.reverse = int
          }, 200)
      },

      // 提交登录
      loginSubmit() {
        this.loginMessage = ""
        //防止重复提交登录
        if(this.subState) {
          return false;
        }
        //校验用户名
        if(!isvalidUsername(this.loginData.username)) {
          this.loginMessage = "请输入正确的用户名";
          return false;
        }
        //检验密码场合是否为空
        if(this.loginData.password === '' || this.loginData.password.length < 6) {
          this.loginMessage = '请输入正确的密码';
          return false;
        }
        this.subState = true;
        this.loginMessage = "";   //清空提示
        this.$store.dispatch("UserLogin", this.loginData).then(response => {
          console.log("返回的登录信息：", response);
          const {code, message} = response;
          if(code === 20000) {   //登录成功，重定向
            window.location.href = this.redirectURL;
          }else {  //登录失败
            this.loginMessage = "用户名或密码错误！！！";
          }
          this.subState = false;
        }).catch(error => {  //后台报错
          console.log("登录返回的报错信息：", error);
          this.loginMessage = "服务器繁忙，请稍后重试！";
          this.subState = false;
        });
      },

      // 提交注册
      async regSubmit() {
        //防止重复注册
        if(this.subState) {
          return false;
        }

        //检查注册的用户名
        if(!isvalidUsername(this.registerData.username)) {
          this.regMessage = "用户名只允许4-30位中文、数字、字母和下划线";
          return false;
        }
        //检查用户名是否已被注册
        const {code, message, data} = await checkUsernameRegister(this.registerData.username);
        if(code !== 20000) {  //如果返回状态不是20000，给出提示
          this.regMessage = message;
          return false;
        }
        if(data) {
          this.regMessage = "用户名已被注册，请重新输入";
          return false;;
        }
        //检验密码是否合法
        if(this.registerData.password.length < 4 || this.registerData.password.length > 30) {
          this.regMessage = "密码长度只能4-30之间";
          return false;
        }
        //检查密码是否相同
        if(this.registerData.password !== this.registerData.repPassword) {
          this.regMessage = "请确认密码是否相同";
          return false;
        }
        //检查协议是否勾选
        if(!this.registerData.check) {
          this.regMessage = "请阅读用户协议并勾选";
          return false;
        }
        this.subState = true;  //登录中
        register(this.registerData).then(response => {
          const { code, message} = response;
          if(code === 20000) {   //注册成功
            //切换到登录页
            //this.$message.success("注册成功，请登录！");
            this.changetab(1);
            this.regMessage = "";   //清空提示内容
            this.registerData.username = "";
            this.registerData.password = "";
            this.registerData.check = false;
            this.registerData.repPassword = "";
            alert("注册成功！！！请登录！！！");
          }else { //注册失败
            this.regMessage = "注册失败，请稍后重试";
          }
          this.subState = false;
        }).catch(error => {
          this.regMessage = "服务器繁忙，请稍后重试";
          this.subState = false;
        });

      }

    },
}
</script>
<style scoped>
@import '../../assets/style/login.css'; 
</style>

