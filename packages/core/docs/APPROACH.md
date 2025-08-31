1. Determing a module loader, between jiti and tsx went with jiti
2. consola for logging since this is not a cli project



@adenta/core stack

1. loader - [jiti](https://github.com/unjs/jiti) 
2. logger - [consola/browser](https://unjs.io/packages/consola) consola for multi-env
3. std-env for env locations
4. c12 to load custom configurator `adenta.config.js` 
4. for glob search - [tinyglobby](https://www.npmjs.com/package/tinyglobby)* optional since c12 can load configs


```tsx


function randomSentence() {
    return "Lorem ipsum dit dolor sit amet"
}


function reporterDemo(
    opts: Partial<ConsolaOptions & { fancy: boolean }>,
) {

    const consola = createConsola({
        ...opts,
        reporters: [
            ...opts.reporters || [],
            new FancyReporter()
        ]
    });



    for (const type of Object.keys(consola.options.types).sort()) {
        consola[type](randomSentence());
    }

    consola.info("JSON", {
        name: "Cat",
        color: "#454545",
    });



    consola.error(new Error(randomSentence()));

    const tagged = consola.withTag("unjs").withTag("router");

    for (const type of Object.keys(consola.options.types).sort()) {
        tagged[type](randomSentence());
    }
}

reporterDemo({ fancy: true })
```