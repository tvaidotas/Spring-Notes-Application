package com.qa.integration;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@TestMethodOrder(OrderAnnotation.class)
public class TodoTemplateTest
{

    static WebDriver driver;

    @BeforeAll
    public static void init(){
        driver = new ChromeDriver();
        driver.get("http://localhost:9000/todoFresh.html");
    }

    @Test
    @Order(1)    
    public void createNewItemTest()
    {
        String expectedItemName = "to do stuff";

        driver.findElement(By.id("newItemDescription")).sendKeys(expectedItemName);
        driver.findElement(By.id("addNewItemButton")).click();

        new WebDriverWait(driver, Duration.ofSeconds(1))
        .until(driver -> driver.findElements(By.id("listItemDescription0")).size() == 1);

        String itemName = driver.findElement(By.id("listItemDescription0")).getText();
        assertEquals(expectedItemName, itemName);
    }

    @Test
    @Order(2)    
    public void markAsCompletedTest()
    {
        driver.findElement(By.id("tick0")).click();
        String classList= driver.findElement(By.id("listItem:0")).getAttribute("class");
        assertTrue(classList.contains("checked"));
    }

    @Test
    @Order(3)    
    public void deleteItemTest()
    {
        driver.findElement(By.id("closeIcon0")).click();
        driver.switchTo().alert().accept();

        assertTrue(driver.findElements(By.id("listItem:0")).isEmpty());
    }

    @Test
    @Order(4)    
    public void searchItemTest()
    {

        String expectedItemName = "to do stuff";
        String expectedItemName2 = "to do another thing";
        String searchKey = "another";

        driver.findElement(By.id("newItemDescription")).sendKeys(expectedItemName);
        driver.findElement(By.id("addNewItemButton")).click();

        driver.findElement(By.id("newItemDescription")).sendKeys(expectedItemName2);
        driver.findElement(By.id("addNewItemButton")).click();

        driver.findElement(By.id("todoSearch")).sendKeys(searchKey);


        new WebDriverWait(driver, Duration.ofSeconds(1))
        .until(driver -> driver.findElements(By.xpath("//li")).size() == 1);
        
        List<WebElement> listOfItems = driver.findElements(By.xpath("//li"));
        assertEquals(1, listOfItems.size());
    }

    @AfterAll
    public static void teardown() {
        driver.findElement(By.id("todoSearch")).clear();
        driver.findElement(By.id("todoSearch")).sendKeys(" ");
      
        new WebDriverWait(driver, Duration.ofSeconds(1))
        .until(driver -> driver.findElements(By.xpath("//li")).size() == 2);

        driver.findElement(By.id("closeIcon1")).click();
        driver.switchTo().alert().accept();

        driver.findElement(By.id("closeIcon0")).click();
        driver.switchTo().alert().accept();

        driver.quit();
    }
}
