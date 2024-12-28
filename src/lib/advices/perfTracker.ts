import { afterMethod } from 'kaop-ts';

export const responseTime = afterMethod(meta => {
    console.log(`method call: ${meta.method.name}()`);
    meta.args.forEach((args, i) => {
        if(i < meta.args.length - 1) console.log(`├── arg: ${JSON.stringify(args)}`);
        else console.log(`└── arg: ${JSON.stringify(args)}`);
    })
    return meta;
})