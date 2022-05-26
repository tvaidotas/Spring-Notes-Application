const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;


// const chrome = require('selenium-webdriver/chrome');




let driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


// let options = new chrome.Options();
// options.setChromeBinaryPath("/Applications/Brave Browser.app/Contents/MacOS/Brave\ Browser")
// let driver_br = new webdriver.Builder()
//     .forBrowser('chrome')
//     .setChromeOptions(options)
//     .build();

    

driver_chr.get('http://127.0.0.1:5500/src/main/java/com/qa/views/todoFresh.html');
  createNewItemTest(driver_chr);
  markAsCompletedTest(driver_chr);

function createNewItemTest(driver) {
  let expectedItemName = "to do stuff";

  driver.findElement(By.id('newItemDescription')).sendKeys(expectedItemName);

  driver.sleep(1000).then(function() {
    driver.findElement(By.id('addNewItemButton')).click();
  });

  driver.sleep(1000).then(function() {
    let itemName = driver.findElement(By.id('listItemDescription0')).getText();
    itemName.then(function(itemName) {
      if(itemName === expectedItemName) {
        console.log('createNewItemTest passed');
      } else {
        console.log('createNewItemTest failed');
      }
    });
  });
}


async function  markAsCompletedTest(driver) {

  driver.wait(until.elementLocated(By.id('listItemDescription0')), 1000).then(el => {
      driver.findElement(By.id('closeIcon0')).click();
      driver.wait(until.alertIsPresent, 1000).then(el => {
        console.log('alert is showing');
        driver.switchTo().alert().accept();
      });
  });

  
}