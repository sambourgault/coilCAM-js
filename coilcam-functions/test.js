import { BABY_POTTERBOT, SUPER_POTTERBOT, createPreset } from './setup/PrinterPresets.js';
export function test2(){
  console.log("test test test");
  return "hi " + BABY_POTTERBOT.name;
}

export function test1(){
  console.log("test test");
  return "hello";
}

export function test0(){
  console.log("test");
  return "greetings";
}