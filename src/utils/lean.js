import AV from 'leancloud-storage';
//正式
//const appId = 'cvmuQcymeEJH75Kwcop1lk5R-gzGzoHsz';
//const appKey = 'mnRaoVzzcSBrzbgjMGBSvW1q';

//测试
const appId='8GgLMbrR15omWrQiGDqrQmYe-gzGzoHsz';
const appKey='XIdguT6U47cUsEjbIAKURhu2';

AV.init({ appId, appKey });
export const DB=AV;