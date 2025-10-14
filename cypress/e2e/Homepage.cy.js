
import 'cypress-mochawesome-reporter/register';

// ✅ Custom command for handling password modal
Cypress.Commands.add('unlockStore', (password = 'DEVsea-bags') => {
  cy.get('.modal__toggle-open').click();
  cy.get('[id="Password"]').type(password);
  cy.get('.password-button').click();
  cy.wait(4000);
});

describe('Homepage Automation Demo', () => {
  const HOME_URL = 'https://seabags-dev1.myshopify.com/';

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.intercept('/some-3rd-party-script.js*').as('externalScript');
    cy.visit(HOME_URL, { failOnStatusCode: false });
    cy.unlockStore();
  });

  // ✅ Header Section (Logo + Menu + Icons)
  it('Validates Header Section: Logo, Tagline, Top Menu & Header Icons', () => {
    // Logo & tagline
    cy.get('img[src*="SeaBags_Logo.svg"]').should('be.visible');
    cy.contains('Handmade in Maine from Recycled Sails').should('be.visible');

    // Top navigation menu
    cy.get('nav').first().within(() => {
      cy.contains('Shop').should('exist');
      cy.contains('New Arrivals').should('exist');
      cy.contains('Customize').should('exist');
      cy.contains('Sale').should('exist');
    });

    // Key links
    cy.xpath("(//span[@class='underline-hover hidden mdl:block'])[1]").should('exist'); // Find A Store
    cy.contains('our story & Impact', { matchCase: false }).should('exist');

    // Header icons
    cy.get('input[type="search"]').should('be.visible');
    cy.get('.visually-hidden').should('be.visible'); // Account icon
    cy.get('#cart-icon-bubble').should('be.visible'); // Cart icon
  });

  // ✅ Hero Section Buttons
  it('Validates "Shop Now" Button', () => {
    cy.get('a.primary_button')
      .first()
      .scrollIntoView({ easing: 'linear', duration: 500 })
      .should(($el) => {
        expect($el.text().trim()).to.eq('SHOP ANCHOR COLLECTION');
      })
      .click({ force: true });

    cy.get('h1').should('contain.text', 'Anchors');
    cy.go('back');
  });

 it('Validates "Shop All" Button', () => {
    cy.contains(/^shop all$/i).filter(':visible').first().click();
    cy.url().should('include', '/all');
    cy.contains('All Products').should('be.visible');
    cy.go('back');
  });
  

  // ✅ Shop By Style Cards
  it('Validates Shop By Style Collection Cards', () => {
    cy.get('[id*="card_collection"]').then(($cards) => {
      const cardCount = $cards.length;

      for (let i = 0; i < cardCount; i++) {
        cy.get('[id*="card_collection"]').eq(i).then(($card) => {
          const id = $card.attr('id');
          cy.log(`Testing card: ${id}`);

          cy.get(`#${id}`)
            .scrollIntoView({ easing: 'linear', duration: 500 })
            .should('be.visible')
            .click({ force: true });

          cy.location('pathname', { timeout: 10000 }).should('include', '/collections');
          cy.get('h1').should('be.visible');

          // ✅ Go back robustly
          cy.visit(HOME_URL);
          cy.get('img[src*="SeaBags_Logo.svg"]').should('be.visible');
        });
      }
    });
  });

  // ✅ Our Mission Section
  it('Validates "See how we do it" & "Learn More" Flow', () => {
    cy.contains('See how we do it').scrollIntoView().click();
    cy.go('back');
    //cy.contains('Our Mission').scrollIntoView().should('be.visible');
    /*cy.contains('LEARN MORE').scrollIntoView().click();
    cy.go('back');*/
  });

/*it.skip('Verifies section title, handle, and follow button', () => {
    // Assert title and Instagram handle
    cy.contains('Carried With Pride').should('exist');
    cy.contains('seabagsmaine').should('exist');

    // Assert and interact with follow button (assuming it links to Instagram)
    cy.contains('FOLLOW').should('be.visible').click();
    cy.go('back');
    // Add assertion for redirect or modal if applicable, e.g., cy.url().should('include', 'instagram.com');
  });

  // ✅ Carried With Pride Section - Product Cards

 it.skip('Clicks each product, verifies details, and goes back', () => {
  const products = [
    { name: '2025 Graduation Wristlet Navy', price: '$30.00' },
    { name: 'All Purpose Tan Tool Bucket Bag', price: '$75.00' },
    { name: '2025 Graduation Wristlet Red', price: '$30.00' },
    { name: 'All Purpose Gray Tool Bucket Bag', price: '$75.00' },
  ];

  // Start with an empty chain
  let chain = cy.wrap(null);

  products.forEach((product, index) => {
    chain = chain.then(() => {
      // Unlock if needed
      cy.get('body').then($body => {
        if ($body.find('.modal__toggle-open').length) {
          cy.unlockStore();
        }
      });

      // Find the product link by name
      return cy.contains('a.font-semibold', product.name, { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .then($link => {
          cy.log(`Clicking product: ${product.name}`);

          // Click the product link
          cy.wrap($link).click({ force: true });

          // Verify product page
          const expectedUrl = `/products/${product.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]/g, '')}`; // Handle special chars safely
          cy.url().should('include', expectedUrl);
          cy.contains(product.name).should('be.visible');
          cy.contains(product.price).should('be.visible');

          // Navigate back to the Carried With Pride section
          cy.go('back');
        });
    });
  });

  // Ensure the chain completes
  return chain;
});


/*it.only('Interacts with carousel navigation', () => {
  // Click next arrow
  cy.get('#template--17430384148528__dynamic_section_BcqfYf-ALzJDTTVMdURzVkpyQ__slider_fh4HW4-next')
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true });

  // 🔑 Wait for the slide animation to complete
  cy.wait(1500); // adjust if your carousel animation is slower

  // ✅ Relax text match (case-insensitive, ignore hidden chars)
  cy.contains(
    '.font-semibold.mbl_sm.mb-0.pb-1.leading-7.animate-underline-from-left.isolate',
    'All Purpose Navy Tool Bucket Bag / Large',
    { matchCase: false, timeout: 10000 } // longer timeout just in case
  ).should('be.visible');

  // Click previous arrow
  cy.get('#template--17430384148528__dynamic_section_BcqfYf-ALzJDTTVMdURzVkpyQ__slider_fh4HW4-prev')
    .should('be.visible')
    .click();

});*/

it('Checks titles and navigates both buttons', () => {

  // 1️⃣ Assert the two section titles
  cy.contains('Visit Our Stores').should('be.visible');
  cy.contains('Customize Your Bag').should('be.visible');

  // 2️⃣ Click "Locate a Store" and verify page, then go back
  cy.contains('a,button', 'Locate a Store', { matchCase: false })
    .scrollIntoView()
    .should('be.visible')
    .click();


  // Go back to main page
  cy.go('back');
  cy.contains('Visit Our Stores').should('be.visible'); // confirm we're back

  // 3️⃣ Click "Start Customizing" and verify page, then go back
  cy.contains('a,button', 'Start Customizing', { matchCase: false })
    .scrollIntoView()
    .should('be.visible')
    .click();

  // ✅ Adjust the assertion below to match your customize page
  cy.url().should('include', '/collections/customize');        // example URL check
  cy.get('h1').should('be.visible');     // example text check

  // Go back again (optional)
  cy.go('back');
  cy.contains('Customize Your Bag').should('be.visible');
});



  /*it.skip('validates each featured publication sequentially with maximum coverage', () => {  
  // Verify the section title exists and check font-family
  cy.get('h1')
    .contains('As Featured In')
    .should('exist')
    .invoke('css', 'font-family')
    .should('match', /jarkten|Bangla476|sans-serif/);

  // Array of publication container class names
  const publicationClasses = [
    '.icon-block-ATlhqVWgxQ3orTFp1V__icon_AF9fbz',   //ATlhqVWgxQ3orTFp1V__icon_AF9fbz 
    '.icon-block-AOGR6Yjl3RVZvY1NpO__icon_4GKf8d',   //AOGR6Yjl3RVZvY1NpO__icon_4GKf8d 
    '.icon-block-AaCttRktnaVlxa1Jsc__icon_HpDYkX',   //AaCttRktnaVlxa1Jsc__icon_HpDYkX 
    '.icon-block-AVHZ0RjhnT2F5YkJzK__icon_TbBjkp',   //AVHZ0RjhnT2F5YkJzK__icon_TbBjkp 
    '.icon-block-AOVRhZjRPZEkrUTBnO__icon_cfD3nk',    //AOVRhZjRPZEkrUTBnO__icon_cfD3nk 
    '.icon-block-AWlZlb3IzMDNuc3BhT__icon_ydxLTQ'     //AWlZlb3IzMDNuc3BhT__icon_ydxLTQ 
  ];

  // Click each publication sequentially
  publicationClasses.forEach((className) => {
    cy.get(className, { timeout: 15000 }) // Increased timeout to 15s
      .should('be.visible')
      .then(($container) => {
        if ($container.length === 0) {
          cy.log(`Container with class ${className} not found.`);
        } else {
          cy.wrap($container)
            .scrollIntoView()
            .click();
          cy.wait(1000); // Wait to observe any changes or effects
        }
      });
  });
});*/


it('asserts hero title, clicks Shop Now, validates next page and goes back', () => {
  // 1️⃣ Assert hero title text
 cy.get('[class*="banner__heading-"]')
  .contains('Mainers United for a Cure') 
  .scrollIntoView() .invoke('text')
   .should('include', 'Mainers United for a Cure');

   // 2️⃣ Click the “SHOP NOW” button
  cy.get('a[class*="group/button"]')  // ✅ use attribute selector with * for partial match
    .contains('SHOP CURE COLLECTION')
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true }); // sometimes needed for overlay elements

  // 3️⃣ Validate page title on the destination page
  cy.get('h1', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'All Products'); // adjust expected text if needed

  // 4️⃣ Return to previous page
  cy.go('back');
});



 /* it.skip('asserts titles', () => {
  // Scroll to and assert the main title
  cy.get('[class*="banner__heading-"]')
    .should('be.visible')
    .contains('Built on recycled and sustainable values.');

  // Titles to check
  const titles = ['USA Made', '1.5M+ Sails', 'Recycled', 'Locally'];

  titles.forEach(title => {
    cy.contains('.block_text.banner__text:visible', title)
      .scrollIntoView()
      .should('be.visible');
  });
});*/




  it('verifies footer content and clicks social media icons', () => {
  cy.get('footer', { timeout: 10000 }).scrollIntoView().should('be.visible');

  cy.get('footer').within(() => {
    // --- Company Logo ---
    cy.contains('Sea Bags').scrollIntoView().should('be.visible');

    // --- Social Icons ---
    const socialLinks = [
      { name: 'Facebook', href: 'fb.com' },
      { name: 'X', href: 'x.com' },
      { name: 'TikTok', href: 'tiktok.com' },
      { name: 'Instagram', href: 'instagram.com' },
      { name: 'LinkedIn', href: 'linkedin.com' }
    ];

    socialLinks.forEach(link => {
      cy.log(`Clicking ${link.name} link`);

      cy.get(`a[href*="${link.href}"]`)
        .should('be.visible')
        .invoke('removeAttr', 'target') // ensure Cypress stays in same tab
        .click();

      // Verify the URL includes the expected social domain
      cy.url().should('include', link.href);

      // Go back to previous page
      cy.go('back');
    });

 // --- Combined Footer Links (Company + Support) ---
const footerLinks = [
  // Company links
  'Our Mission',
  'About Sea Bags',
  'Corporate Sales',
  'Wholesale',
  'Donation Request Form',
  'PR',
  'Careers',
  'Sea Bags Sailing Team',
  'Green Circle Certified',
  // Support links
  'Help Center',
  'Your Account',
  'Order Status',
  'Shipping Information',
  'Returns & Exchanges',
  'FAQs'
];

footerLinks.forEach(text => {
  cy.contains('a', text)
    .should('be.visible')
    .then($el => {
      const href = $el.attr('href');
      if (href && href !== '#' && !href.startsWith('javascript')) {
        cy.visit(href);
        cy.go('back');
      } else {
        cy.log(`Skipping link: ${text} (invalid href: ${href})`);
      }
    });
});



  })
  })

})