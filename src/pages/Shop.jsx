const Shop = () => {
  return (
    <div className="shop-page" role="region" aria-label="Shop teaser">
      <div className="shop-card">
        <p className="eyebrow">Merch drop</p>
        <h1>Threads In Time</h1>
        <p>
          Welcome to Threads in Time — a growing collection of historically inspired designs from Places in Time.
Each piece is part of our journey through the past, with new designs added regularly. If there’s a place, figure, or moment you’d love to see brought to life, let us know. You are welcome to send us a message. We’re always open to ideas from fellow time travelers.
          {/* TODO: swap copy when merch catalog is ready */}
        </p>
       
        <a className="button primary" href="https://www.redbubble.com/people/alex-bunting/shop" target="_blank" rel="noreferrer">
          Shop Threads
        </a>
      </div>
    </div>
  )
}

export default Shop
