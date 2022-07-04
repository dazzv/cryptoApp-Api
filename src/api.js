export const loadTickers = tickers => {
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join()}&tsyms=USD`)
        .then(r => r.json())
        .then(rawData => Object.fromEntries( //[["a", 1], ["b", 0.5]] => {a : 1, b : 0.5}
          Object.entries(rawData).map(([key, value]) => [key, value.USD])
          // {a: 1, b: 2} => [["a", 1], ["b", 2]] => [["a", 1], ["b", 0.5]]
        ));
};
