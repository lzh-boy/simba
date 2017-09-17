define(["jquery","template"],function($,tmpl){ 
	"use strict";
	/*
	 TODO:组件要考虑用户可修改，样式可定义 
	 */
	var config = {
		 allowRewrite:false /* 允许覆盖插件 */ 
	};
	 
	// TODO:所有的组件都应该有AJAX的功能
	var WidgetFactory = {
		constructMap:{}, /* 组件字典 */
		define:function(name,defineContext){ /* 组件定义函数 */
			/* TODO: 需要封装 defineContext 的私有内容 */
			var Widget = this.constructMap[name];
			if(Widget){
				if(!config.allowRewrite){
					throw 'confict widget by name '+ name;
				}
				console.log('override widget by name ' + name); 
			}
			
			Widget = function(name,op,data,dom){
				this._task = [];
				this.name = name;
				this.op = op;
				this.data = data;
				this.dom = dom;
			};
			
			Widget.prototype = {
				constructor:Widget,
				on:function(eventName){
					
				},
				un:function(){
					
				},
				refresh:function(op,data){
					
				}
			} 
			
			Widget.define = defineContext;
			
			this.constructMap[name] = Widget;
		},
		defineAPI:function(name,apiConstuct){
			
		} 
	} 
	
	var idMap = {"__id":0};
	var componentMap = {};
	var buildComponentId = function(prix){
		var key=prix || "__id"; 
		var cidx = (idMap[key] = idMap[key] ? idMap[key]++ : 1);
		return key + cidx;
	}
	
	var COMPONENT_DEF_OP = {
		id:null,
		ajax:{},
	}

	$.fn.xWidget = function(name, op, data) {
		if(!arguments.length){
			return this.each(function(){
				var self = $(this); 
			});
		}
		
		//debugger
		return this.each(function() {
			var self = $(this); 
			var _id = buildComponentId(name);
			var $widgetBegin = $("<!-- {0}::{1} begin -->".format(name,_id))
			//$widgetBegin.data("widget",name);
			var $widgetEnd =   $("<!-- {0}::{1} end -->".format(name,_id))
			self.before($widgetBegin);
			self.after($widgetEnd)
			self.empty().remove(); 
			// 获取组件内容
			debugger
			var Widget = WidgetFactory.constructMap[name]; 
			var widgetDefine = Widget.define;
			if(widgetDefine.templateUri /*&& !widgetDefine.template*/){
				debugger
				var templateUri = appConfig.contextPath + "/" +widgetDefine.templateUri;
				$.get(templateUri).success(function(html){ 
					debugger
					var tmpl = require("template");
					tmpl(templateUri,html);
					var templatedHtml = tmpl(templateUri, {
					    value: 'aui'
					});
					widgetDefine.template = templatedHtml;
					$widgetBegin.after(widgetDefine.template);
					var widgetManager = new Widget(name,op,data,null);
					componentMap[_id] = widgetManager;
				}).error(function(err){
					console.log(err);
					if(err.status==404){
						widgetDefine.template = "no found component for uri "+
						$widgetBegin.after(widgetDefine.template);
						var widgetManager = new Widget(name,op,data,null);
						componentMap[_id] = widgetManager;
					} 
				});
			}else{
				$widgetBegin.after(widgetDefine.template);
				var widgetManager = new Widget(name,op,data,null);
				componentMap[_id] = widgetManager;
				//alert($widgetBegin.data("widget"));
			}
		
		});
	}

	/**
	 * 组件
	 */
	$.xWidget = function(el,name, op, data) {
		var el, name, op, data,widget;
		var args = arguments;

		switch (args.length) {
		case 1:
			name = args[0];
			break;
		case 2:
			name = args[0], op = args[1];
			break;
		case 3:
			name = args[0], op = args[1], data = args[2];
			break;
		case 4:
			el = args[0], name = args[1], op = args[2], data = args[3];
			break;
		default:
			throw 'no support arguments length by $.xWidget';
		}
		
		if(el){
			if(widget = $(el).data("__widget")){
				return widget;
			} 
		}else{
			var widgetConstruct = WidgetFactory.constructMap[name];
			if(widgetConstruct){
				
			}
		}

	}
	
	return WidgetFactory;
})