(async () => {
    const selected = 'add'
    let fns

    if (selected === 'add') {
        fns = await import("./libs/add")
    }
    if (selected === 'subtract') {
        fns = await import("./libs/substact")
    }

    const result = fns.default(10, 8)
    console.log(result)
})()
