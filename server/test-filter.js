

const testFilter = async () => {
  try {
    console.log("Fetching Men's watches...");
    const resMen = await fetch('http://localhost:3001/api/products?category=Men');
    const men = await resMen.json();
    console.log(`Found ${men.length} Men's watches.`);
    men.forEach(p => {
      if (p.category !== 'Men') console.error(`Error: Found ${p.category} in Men's filter`);
    });

    console.log("\nFetching Women's watches...");
    const resWomen = await fetch('http://localhost:3001/api/products?category=Women');
    const women = await resWomen.json();
    console.log(`Found ${women.length} Women's watches.`);
    women.forEach(p => {
      if (p.category !== 'Women') console.error(`Error: Found ${p.category} in Women's filter`);
    });

    console.log("\nFetching All watches...");
    const resAll = await fetch('http://localhost:3001/api/products');
    const all = await resAll.json();
    console.log(`Found ${all.length} total watches.`);

  } catch (error) {
    console.error("Test failed:", error);
  }
};

testFilter();
