const API_KEY = "9e75fe3943538323d347345d62e661502ee07ed0fd51f0cb850d6bd1b946d6e3";

const tickersHandlers = new Map();
//подключение через websocket
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const loadTickers = () => {
  if(tickersHandlers.size === 0) {
    return;
  }

  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
    ...tickersHandlers.keys()].join(",")}&tsyms=USD`)
    .then(r => r.json())
    .then(rawData => {
      //[["a", 1], ["b", 0.5]] => {a : 1, b : 0.5}
      const updatedPrices = Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD]))
                        // {a: 1, b: 2} => [["a", 1], ["b", 2]] => [["a", 1], ["b", 0.5]]
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice));
      })                  
    });
};

// когда обновиться такой то ticker, вызови функцию callback
export const subscribeToTicker = (ticker, callback) => {
  const subscriber = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscriber, callback]);
}

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker)
}

setInterval(loadTickers, 5000);
// window.tickers = tickers;