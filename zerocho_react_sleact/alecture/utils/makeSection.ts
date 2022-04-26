import { IDM } from "@typings/db";
import dayjs from "dayjs";

export default function makeSection(chatList : IDM[]){
  const sections : {[key:string] : IDM[]} = {};
  chatList.forEach((chat) => {
    const monthData = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if(Array.isArray(sections[monthData])){
      sections[monthData].push(chat);
    }else{
      sections[monthData] = [chat]
    }
  });

  return sections;
}