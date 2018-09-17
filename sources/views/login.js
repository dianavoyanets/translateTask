import {JetView} from "webix-jet";

export default class LoginView extends JetView{
	config() {
		const _ = this.app.getService("locale")._;

		const login_register_form = {
			view: "tabview",
			cells: [
				{
					header: "Login",
					body: {
						view: "form",
						localId: "login:form",
						elements:[
							{ view:"text", name:"login", label:_("User Name:"),labelWidth:110,width: 350},
							{ view:"text",name:"pass", label:_("Password:"),type:"password",labelWidth:110,width: 350},
							{rows:[
								{view:"button", value:_("Login"), click:() => this.doLogin(), hotkey:"enter",width:100,align:"right"},
							]}
						],
						rules:{
							login:webix.rules.isNotEmpty,
							pass:webix.rules.isNotEmpty
						}
					}
				},
				{
					header: "Register",
					body: {
						view: "form",
						localId: "register:form",
						elements: [
							{ view:"text", name:"login", label:_("User Name:"),labelWidth:100,width: 350,invalidMessage: "Login can not be empty"},
							{ view:"text",name:"pass", label:_("Password:"), type:"password",labelWidth:100,width: 350,invalidMessage: "Password can not be empty"},
							{rows:[
								{ view:"button", value:_("Register"), click:() => this.doRegister(), hotkey:"enter",width:100,align:"right"}
							]},
						],
						rules:{
							login:webix.rules.isNotEmpty,
							pass:webix.rules.isNotEmpty
						}
						
					}
				}
			]
		};

		return {
			rows:[
				{view: "spacer"},
				{cols: [
					{view:"spacer"},
					login_register_form,
					{view: "spacer"}
				],
				},
				{view:"spacer"}
			]
		};
	}

	init(view){
		view.$view.querySelector("input").focus();
	}

	doLogin() {
		const user = this.app.getService("user");
		const form = this.$$("login:form");

		if (form.validate()){
			const data = form.getValues();
            
			user.login(data.login, data.pass)
				.catch(function() {
					form.elements.pass.focus();
					webix.delay(function() {
						webix.message("Incorrect login or password");
					});
				});
		}
	}
    
	doRegister() {
		const form = this.$$("register:form");

		if (form.validate()) {
			const data = form.getValues();
            
			webix
				.ajax()
				.post("/server/user/register", { 
					user: data.login, 
					pass: data.pass 
				})
				.then( response => {
					debugger
					response.json(),webix.message(response.json().message)
				})
			
		}
	}
}