parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var q=function(){var exports=this,module={exports:this},path=[],updatedPath=!1;function updatePath(e){updatedPath=!0,path=e,main()}function createShader(e,t,r){var a=e.createShader(t);if(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS))return a;console.log(e.getShaderInfoLog(a)),e.deleteShader(a)}function createProgram(e,t,r){var a=e.createProgram();if(e.attachShader(a,t),e.attachShader(a,r),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS))return a;console.log(e.getProgramInfoLog(a)),e.deleteProgram(a)}function main(){var e=document.querySelector("#canvas").getContext("webgl");if(e){var t=webglUtils.createProgramFromScripts(e,["vertex-shader-3d","fragment-shader-3d"]),r=e.getAttribLocation(t,"a_position"),a=(e.getUniformLocation(t,"u_color"),e.getUniformLocation(t,"u_matrix")),n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),setPath(e,path);c(0),c(60);var o=[document.getElementById("canvas").width,500,0],i=[c(90),c(0),c(0)],l=[1,1,1];Math.random(),Math.random(),Math.random();v(),webglLessonsUI.setupSlider("#x",{value:o[0],slide:u(0),max:e.canvas.width}),webglLessonsUI.setupSlider("#y",{value:o[1],slide:u(1),max:e.canvas.height}),webglLessonsUI.setupSlider("#z",{value:o[2],slide:u(2),max:e.canvas.height}),webglLessonsUI.setupSlider("#angleX",{value:s(i[0]),slide:d(0),max:360}),webglLessonsUI.setupSlider("#angleY",{value:s(i[1]),slide:d(1),max:360}),webglLessonsUI.setupSlider("#angleZ",{value:s(i[2]),slide:d(2),max:360}),webglLessonsUI.setupSlider("#scaleX",{value:l[0],slide:m(0),min:-5,max:5,step:.01,precision:2}),webglLessonsUI.setupSlider("#scaleY",{value:l[1],slide:m(1),min:-5,max:5,step:.01,precision:2}),webglLessonsUI.setupSlider("#scaleZ",{value:l[2],slide:m(2),min:-5,max:10,step:.01,precision:2}),updatedPath&&(v(),updatedPath=!1)}function s(e){return 180*e/Math.PI}function c(e){return e*Math.PI/180}function u(e){return function(t,r){o[e]=r.value,v()}}function d(e){return function(t,r){var a=r.value*Math.PI/180;i[e]=a,v()}}function m(e){return function(t,r){l[e]=r.value,v()}}function v(){webglUtils.resizeCanvasToDisplaySize(e.canvas),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.enable(e.CULL_FACE),e.enable(e.DEPTH_TEST),e.useProgram(t),e.enableVertexAttribArray(r),e.bindBuffer(e.ARRAY_BUFFER,n);var s=e.FLOAT,c=0;e.vertexAttribPointer(r,3,s,!1,0,c);var u=e.canvas.clientWidth,d=e.canvas.clientHeight,m=m4.orthographic(0,u,d,0,400,-400);m=m4.translate(m,o[0],o[1],o[2]),m=m4.xRotate(m,i[0]),m=m4.yRotate(m,i[1]),m=m4.zRotate(m,i[2]),m=m4.scale(m,l[0],l[1],l[2]),e.uniformMatrix4fv(a,!1,m);var v=e.LINE_STRIP,h=(c=0,path.length/3);e.drawArrays(v,c,h)}}var m4={perspective:function(e,t,r,a){var n=Math.tan(.5*Math.PI-.5*e),o=1/(r-a);return[n/t,0,0,0,0,n,0,0,0,0,(r+a)*o,-1,0,0,r*a*o*2,0]},orthographic:function(e,t,r,a,n,o){return[2/(t-e),0,0,0,0,2/(a-r),0,0,0,0,2/(n-o),0,(e+t)/(e-t),(r+a)/(r-a),(n+o)/(n-o),1]},projection:function(e,t,r){return[2/e,0,0,0,0,-2/t,0,0,0,0,2/r,0,-1,1,0,1]},multiply:function(e,t){var r=e[0],a=e[1],n=e[2],o=e[3],i=e[4],l=e[5],s=e[6],c=e[7],u=e[8],d=e[9],m=e[10],v=e[11],h=e[12],p=e[13],f=e[14],g=e[15],x=t[0],y=t[1],A=t[2],R=t[3],M=t[4],C=t[5],b=t[6],S=t[7],L=t[8],I=t[9],P=t[10],U=t[11],w=t[12],_=t[13],T=t[14],B=t[15];return[x*r+y*i+A*u+R*h,x*a+y*l+A*d+R*p,x*n+y*s+A*m+R*f,x*o+y*c+A*v+R*g,M*r+C*i+b*u+S*h,M*a+C*l+b*d+S*p,M*n+C*s+b*m+S*f,M*o+C*c+b*v+S*g,L*r+I*i+P*u+U*h,L*a+I*l+P*d+U*p,L*n+I*s+P*m+U*f,L*o+I*c+P*v+U*g,w*r+_*i+T*u+B*h,w*a+_*l+T*d+B*p,w*n+_*s+T*m+B*f,w*o+_*c+T*v+B*g]},translation:function(e,t,r){return[1,0,0,0,0,1,0,0,0,0,1,0,e,t,r,1]},xRotation:function(e){var t=Math.cos(e),r=Math.sin(e);return[1,0,0,0,0,t,r,0,0,-r,t,0,0,0,0,1]},yRotation:function(e){var t=Math.cos(e),r=Math.sin(e);return[t,0,-r,0,0,1,0,0,r,0,t,0,0,0,0,1]},zRotation:function(e){var t=Math.cos(e),r=Math.sin(e);return[t,r,0,0,-r,t,0,0,0,0,1,0,0,0,0,1]},scaling:function(e,t,r){return[e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1]},translate:function(e,t,r,a){return m4.multiply(e,m4.translation(t,r,a))},xRotate:function(e,t){return m4.multiply(e,m4.xRotation(t))},yRotate:function(e,t){return m4.multiply(e,m4.yRotation(t))},zRotate:function(e,t){return m4.multiply(e,m4.zRotation(t))},scale:function(e,t,r,a){return m4.multiply(e,m4.scaling(t,r,a))},inverse:function(e){var t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],i=e[5],l=e[6],s=e[7],c=e[8],u=e[9],d=e[10],m=e[11],v=e[12],h=e[13],p=e[14],f=e[15],g=d*f,x=p*m,y=l*f,A=p*s,R=l*m,M=d*s,C=a*f,b=p*n,S=a*m,L=d*n,I=a*s,P=l*n,U=c*h,w=v*u,_=o*h,T=v*i,B=o*u,E=c*i,F=t*h,D=v*r,N=t*u,z=c*r,Y=t*i,k=o*r,H=g*i+A*u+R*h-(x*i+y*u+M*h),O=x*r+C*u+L*h-(g*r+b*u+S*h),j=y*r+b*i+I*h-(A*r+C*i+P*h),$=M*r+S*i+P*u-(R*r+L*i+I*u),V=1/(t*H+o*O+c*j+v*$);return[V*H,V*O,V*j,V*$,V*(x*o+y*c+M*v-(g*o+A*c+R*v)),V*(g*t+b*c+S*v-(x*t+C*c+L*v)),V*(A*t+C*o+P*v-(y*t+b*o+I*v)),V*(R*t+L*o+I*c-(M*t+S*o+P*c)),V*(U*s+T*m+B*f-(w*s+_*m+E*f)),V*(w*n+F*m+z*f-(U*n+D*m+N*f)),V*(_*n+D*s+Y*f-(T*n+F*s+k*f)),V*(E*n+N*s+k*m-(B*n+z*s+Y*m)),V*(_*d+E*p+w*l-(B*p+U*l+T*d)),V*(N*p+U*a+D*d-(F*d+z*p+w*a)),V*(F*l+k*p+T*a-(Y*p+_*a+D*l)),V*(Y*d+B*a+z*l-(N*l+k*d+E*a))]},vectorMultiply:function(e,t){for(var r=[],a=0;a<4;++a){r[a]=0;for(var n=0;n<4;++n)r[a]+=e[n]*t[4*n+a]}return r}};function setGeometry(e){e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,0,30,0,0,0,150,0,0,150,0,30,0,0,30,150,0,30,0,0,100,0,0,30,30,0,30,30,0,100,0,0,100,30,0,30,60,0,67,60,0,30,90,0,30,90,0,67,60,0,67,90,0]),e.STATIC_DRAW)}function setPath(e,t){e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW)}function setUpCodeMirror(){var textArea,textArea2,myCodeMirror,consoleCodeMirror,codeDiv,codeDivHeader,runButton,h2,codeDiv2,codeDivHeader2,clearButton,h2_2,saveButton,saveName;function runCode(){var codeToRun=myCodeMirror.getValue();try{consoleCodeMirror.replaceRange("$ "+eval("".concat(codeToRun))+"\n",CodeMirror.Pos(consoleCodeMirror.lastLine()))}catch(err){consoleCodeMirror.replaceRange("$ "+err+"\n",CodeMirror.Pos(consoleCodeMirror.lastLine()))}}function saveCode(){var e=saveName.value(),t=myCodeMirror.getValue();t=t.replace(/\n/g,"\r\n");var r=new Blob([t],{type:"text/plain"}),a=document.createElement("a");a.download=e?e+".txt":"untitled.txt",a.href=window.URL.createObjectURL(r),a.target="_blank",a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a)}textArea=document.getElementById("editor"),textArea.className="codemirror_textarea",textArea.style.marginLeft="20px",textArea.style.width="90%",textArea.style.height="200px",myCodeMirror=CodeMirror.fromTextArea(textArea,{lineNumbers:!0,mode:"javascript",extraKeys:{"Ctrl-Space":"autocomplete"}}),textArea2=document.getElementById("console"),textArea2.className="codemirror_textarea",textArea2.style.marginLeft="20px",textArea2.style.width="90%",textArea2.style.height="200px",consoleCodeMirror=CodeMirror.fromTextArea(textArea2,{lineNumbers:!0,mode:"javascript"}),document.getElementById("b_run").addEventListener("click",runCode),document.getElementById("b_save").addEventListener("click",saveCode)}return setUpCodeMirror(),main(),module.exports}.call({});if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=q}else if(typeof define==="function"&&define.amd){define(function(){return q})}return{"xoC2":q};});