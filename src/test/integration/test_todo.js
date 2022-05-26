const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver_chr.get('http://127.0.0.1:5500/src/main/java/com/qa/views/todoFresh.html');

createNewItemTest(driver_chr);
markAsCompletedTest(driver_chr);
deleteItemTest(driver_chr);
searchItemTest(driver_chr);


async function createNewItemTest(driver) {
  let expectedItemName = "to do stuff";

  await driver.findElement(By.id('newItemDescription')).sendKeys(expectedItemName);
  await driver.findElement(By.id('addNewItemButton')).click();
  let itemName = driver.findElement(By.id('listItemDescription0')).getText();
  itemName.then(function(itemName) {
    if(itemName === expectedItemName) {
      console.log('createNewItemTest passed');
    } else {
      console.log('createNewItemTest failed');
    }
  });
}


async function  markAsCompletedTest(driver) {
  driver.wait(until.elementLocated(By.id('listItemDescription0')), 1000).then(el => {
    let element = driver.findElement(By.id('tick0'));
    element.click();
    let classListPromise = driver.findElement(By.id('listItem:0')).getAttribute("class");
    classListPromise.then(function(classList) {
      if(classList.includes('checked')) {
        console.log('markAsCompletedTest passed');
      } else {
        console.log('markAsCompletedTest failed');
      }
    });
  });
}

async function deleteItemTest(driver) {
  driver.wait(until.elementLocated(By.id('listItemDescription0')), 1000).then(el => {
      driver.findElement(By.id('closeIcon0')).click();
      driver.wait(until.alertIsPresent, 1000).then(el => {
        console.log('alert is showing');
        driver.switchTo().alert().accept();
      });
  });
}

async function searchItemTest(driver) {
  let expectedItemName = "to do stuff";
  let expectedItemName2 = "to do another thing";
  let searchKey = "another";

  await driver.findElement(By.id('newItemDescription')).sendKeys(expectedItemName);
  await driver.findElement(By.id('addNewItemButton')).click();

  await driver.findElement(By.id('newItemDescription')).sendKeys(expectedItemName2);
  await driver.findElement(By.id('addNewItemButton')).click();

  await driver.findElement(By.id('todoSearch')).sendKeys(searchKey);


  driver.sleep(1000).then(function() {
    let temp = driver.findElement(By.id('todoList'));
    temp.findElements(By.xpath("//li")).then(elements => {
      if(elements.length === 1) {
        console.log('searchItemTest passed');
      } else {
        console.log('searchItemTest failed');
      }
      cleanUpAfterSearch(driver);
    });
  });
}

async function cleanUpAfterSearch(driver){
  await driver.findElement(By.id('todoSearch')).clear();
  await driver.findElement(By.id('todoSearch')).sendKeys(' ');

  driver.wait(until.elementLocated(By.id('listItemDescription1')), 1000).then(el => {
    driver.findElement(By.id('closeIcon1')).click();
    driver.wait(until.alertIsPresent, 1000).then(el => {
      console.log('listItemDescription1 is getting deleted');
      driver.switchTo().alert().accept();
    });
  });
  driver.wait(until.elementLocated(By.id('listItemDescription0')), 1000).then(el => {
      driver.findElement(By.id('closeIcon0')).click();
      driver.wait(until.alertIsPresent, 1000).then(el => {
        console.log('listItemDescription0 is getting deleted');
        driver.switchTo().alert().accept();
      });
  });
}