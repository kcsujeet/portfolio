---
title: "How to Handle Date and Time Correctly to Avoid Timezone Bugs"
description: "Learn how to handle date and time correctly in your applications to avoid timezone-related bugs. This guide covers real-world examples, best practices, and tips for testing timezone differences."
pubDate: 2025-02-25T12:00:00-04:00
tags: ["datetime", "timezone", "javascript", "rails"]
devto: "https://dev.to/kcsujeet/how-to-handle-date-and-time-correctly-to-avoid-timezone-bugs-4o03"
---

## Introduction
Working with date and time in software applications can be surprisingly tricky. A date that makes perfect sense in one timezone may be completely incorrect in another. Timezone-related bugs are a nightmare for developers. They often lead to various issues that result in confused, frustrated users and even potential financial losses.

In this guide, I’ll share the learnings I’ve gathered while navigating these challenges over the years and show you how you can avoid common pitfalls when working with date and time in your applications.

**What We Will Cover**
✅ Why Do Timezone Issues Occur
✅ Real-world examples of timezone-related problems
✅ How to test timezone differences in your browser
✅ Best practices for handling date-time correctly
✅ Best practices for displaying date-time in the front end
✅ Conclusion

## Why Do Timezone Issues Occur?

### Storing Only Dates Can Cause Issues
One of the most common sources of timezone-related issues is the way dates are stored. Many systems store dates in the format `YYYY-MM-DD` (e.g., `2025-01-01`). However, this format does not contain all the information necessary to correctly interpret the date, especially information about time zones.

For example, consider an event management system:
- A user in Tokyo schedules an online event for `2025-01-01`.
- The system stores just `2025-01-01` without specifying a timezone.
- A user in Toronto sees `2025-01-01` but assumes it is their local date.
- Due to timezone differences, when it's `January 1` in Tokyo, it is still `December 31` in Toronto.
- This could lead to the Toronto user missing the event entirely because they interpreted the date incorrectly.

### Storing Only Time Can Also Be a Problem
Similarly, many systems store time separately, using formats like `HH:MM` (e.g., `10:00`) or as seconds since midnight (eg. `36000`). However, without the date and timezone context, this can cause serious issues.

For example, consider a global meeting scheduling app:
- A user in Tokyo schedules a meeting at `10:00` (i.e `10 am`).
- The system stores just `10:00` without specifying the timezone.
- A user in Toronto sees `10:00` but assumes it is their local time, which is incorrect.
- The meeting happens at the wrong time for the Toronto user, leading to confusion.

This demonstrates why both date and time should always be stored with timezone information.

## Real-world examples of timezone-related problems
Let's look at some more examples to understand the timezone issues better. 

###  Example 1: Server Misinterprets the Date

- Let's say you have a SaaS app with a subscription-based service. 
- A user in `Toronto (UTC-5)` signs up to your app and sets a subscription renewal date as `Jan 1, 2025`. 
- So, the value `2025-01-01` is sent to the server and stored in the database.
- The user expects their subscription to renew at midnight in Toronto on `2025-01-01`.  
- However, the server is in `Tokyo (JST)` and thus, the server interprets `2025-01-01` in JST timezone, which is `14 hours` earlier than Toronto time, meaning it's still `2024-12-31` in Toronto.
- As a result, the user will think they were charged before the set date and may lose trust in the service.

**Code Illustration:**
Server-Side (Ruby):
```ruby
# Server stores renewal date as "2025-01-01" in JST
renewal_date = Date.parse('2025-01-01')

puts "Renewal Date (JST): #{renewal_date}" 
# Output: "Renewal Date (JST): 2025-01-01"
```
Client-Side (JavaScript):
```javascript
// Server sends renewal date as "2025-01-01" (JST)
const renewalDate = "2025-01-01";

// Browser parses it in the user's local time zone (Toronto, UTC-5)
const renewalDateLocal = new Date(renewalDate);
console.log("Local Renewal Date:", renewalDateLocal); 
// Output: Tue Dec 31 2024 19:00:00 GMT-0500 (Eastern Standard Time)
```

###  Example 2: Client Misinterprets the Date

- Let's say you have an app where students can register for an examination online.
- A registration deadline of `2025-01-01` is scheduled for an examination.
- The server, which is in `Tokyo (JST)`, processes the deadline as midnight JST.
- A student is in `Toronto (UTC-5)`, which is 14 hours behind JST.
- The student's browser gets the deadline and parses it in Toronto timezone (EST), so the student sees `7:00 PM on Dec 31, 2024`.
- However, the backend will stop accepting applications at midnight JST, which is still `10:00 AM on Dec 31, 2024`, in Toronto.
- Therefore, when the student tries to register for the exam at `11:00 am on Dec 31, 2024 (Toronto time)`, thinking they’re within the deadline, the system rejects the registration since the deadline has already passed in JST.

**Code Illustration:**

Server-Side (Ruby):

```ruby
# Server stores deadline as "2025-01-01" in JST
deadline = Date.parse('2025-01-01')

puts "Deadline (JST): #{deadline}" 
# Output: "Deadline (JST): 2025-01-01"
```

Client-Side (JavaScript):

```javascript
// Server sends deadline as "2025-01-01" (JST)
const deadline = "2025-01-01";

// Browser parses it in the student's local time zone (Toronto, UTC-5)
console.log(new Date(deadline)); 
// Output: Tue Dec 31 2024 19:00:00 GMT-0500 (Eastern Standard Time)
```

## How to test timezone differences in your browser
You can change the timezone for a specific tab in your browser using Chrome DevTools.

1. Open Developer Tools (`F12` or `Ctrl + Shift + I` on Windows/Linux, `Cmd + Option + I` on macOS).
2. Go to the Sensors: `Three dots at top right → More tools → Sensors`.
3. Under the location dropdown, select a different location (e.g., San Francisco or Tokyo).
4. Run the following JavaScript snippet in the browser console:

```javascript
console.log("Current Local Time:", new Date());

console.log("2025-01-01 in local timezone:", new Date('2025-01-01'));
```

Try these same values with different timezones and see what outputs you get.

## Best practices for handling date-time correctly
The golden rule for handling either date or time is to always store date and time in `UTC` in `ISO8601` format. `ISO8601` is a standard date-time format that ensures consistency across different systems and timezones. By using this format, your application will be able to represent dates and times accurately, regardless of where your users are located.

The full `ISO8601` format looks like this: `YYYY-MM-DDTHH:mm:ssZ`
- `YYYY`: Year (4 digits)
- `MM`: Month (2 digits, from 01 to 12)
- `DD`: Day of the month (2 digits, from 01 to 31)
- `T`: Separator between date and time
- `HH`: Hour (2 digits, from 00 to 23, in 24-hour format)
- `mm`: Minute (2 digits, from 00 to 59)
- `ss`: Second (2 digits, from 00 to 59)
- `Z`: UTC time (indicates zero timezone offset) or a specific timezone offset like +09:00 for Tokyo, or -05:00 for Toronto.

In the format `YYYY-MM-DDTHH:mm:ssZ`, the Z indicates that the time is in `UTC (Coordinated Universal Time)`. The Z can also be replaced with the appropriate timezone offset.

Examples of ISO8601 with Different Timezones:
- UTC (Coordinated Universal Time):
 - `2025-01-01T00:00:00Z`
 - The Z at the end indicates that this time is in UTC (i.e., zero offset).
- Tokyo (Japan Standard Time - JST, UTC +9 hours):
 - `2025-01-01T00:00:00+09:00`
 - The +09:00 offset indicates that this time is 9 hours ahead of UTC (Japan Standard Time).
- Toronto (Eastern Standard Time - EST, UTC -5 hours):
 - `2025-01-01T00:00:00-05:00`
 - The -05:00 offset indicates that this time is 5 hours behind UTC (Eastern Standard Time).

### Converting date to ISO format:
#### On the Server Side (Ruby):
Always use timestamps (for both date and time fields) instead of just dates or times. In Ruby, it's best to use the `Time` (instead of `Date` or `DateTime`) class for precise timestamps, as it includes both the date and the time, along with timezone support.

``` ruby
require 'time'

# Create a time object with a specific date and time
birthday = Time.new 

# Convert to ISO8601 format
iso_string = birthday.iso8601
puts iso_string 
# Output: "2025-01-01T00:00:00+00:00"
```

#### On the Client Side (JavaScript):
Again, always use timestamps. When sending date or time to the back-end, use `ISO8601` format. In JavaScript, the `Date` object has a `.toISOString()` method that converts it to an `ISO8601` string.

Example:
```javascript
// Get current date and time
const deadline = new Date();

// Convert to ISO8601 format
const isoString = deadline.toISOString();
console.log(isoString); 
// Output: "2025-01-01T00:00:00.000Z"
```

A great feature of modern browsers is that when you send a `Date` object in an HTTP request (like in a JSON payload), the browser automatically converts it to `ISO8601` format using `.toISOString`.

Example with HTTP Request:
```javascript 
const birthDay = new Date();
fetch('https://dummyjson.com/users/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Anil',
    lastName: 'Devkota',
    age: 25,
    birthDay // automatically converted to ISO format
  })
})
.then(res => res.json())
.then(console.log);
```
If you open the browser’s network tab, you'll see a payload that looks something like this.

```json
{
    age: 25
    birthDay: "2025-01-01T00:00:00.000Z"
    firstName: "Anil"
    lastName: "Devkota"
}
```

> **NOTE**:  The `.toISOString()` method always converts the time to `UTC`, regardless of the local timezone of the user. This means that if the user is in a different timezone (e.g., Toronto, Eastern Standard Time, `UTC-5`), the output of `.toISOString()` will be in `UTC` rather than their local time.
> 
> Example:
> Let's say the local time is `2025-01-01T05:00:00` in Toronto (Eastern Standard Time). When you use `.toISOString()`, the time will be converted to UTC (which will be `2025-01-01T10:00:00.000Z`).
>
> ```javascript
> const localTime = new Date('2025-01-01T05:00:00')
> const isoString = localTime.toISOString()
> console.log(isoString) // Output: `2025-01-01T10:00:00.000Z`
> ```
> &#x200B;
> This is perfectly fine. This is what we want, a UTC timestamp. Don't get confused.

#### But how does ISO8601 format help to avoid timezone issues?
You might be wondering why this format prevents timezone issues. To illustrate this, let’s revisit the examination deadline example.

##### The Issue:
- The server (in Tokyo, JST) sets the deadline as midnight JST (`2025-01-01`).
- A student in Toronto (UTC-5) receives this but their browser displays it in local time as `7:00 PM` on Dec 31, 2024.
- However, the system stops accepting applications at `10:00 AM` on Dec 31, 2024 (Toronto time), which is midnight JST.
- The student, thinking they have until `11:59 PM` Toronto time, registers too late and gets rejected.

##### The Fix: Use ISO8601 with UTC
By storing and sending `2024-12-31T15:00:00Z` (midnight JST in UTC), the client correctly converts it to local time.

Server-Side (Ruby)
```ruby
require 'time'

# Store deadline with explicit UTC time
deadline = Time.new.getutc

puts deadline.iso8601  
# Output: "2024-12-31T15:00:00Z"
```
Client-Side (JavaScript)
```javascript
// Server sends "2024-12-31T15:00:00Z"
const deadline = "2024-12-31T15:00:00Z";

// When creating a new Date object, the browser converts UTC to local time
console.log(new Date(deadline));  
// Output in Toronto (UTC-5): Tue Dec 31 2024 10:00:00 GMT-0500 (Eastern Standard Time)

```

##### Why This Works
When you pass an `ISO8601` UTC string (`2024-12-31T15:00:00Z`) into `new Date()`, the browser automatically converts it to the user’s local time zone.

So, instead of assuming `7:00 PM` local time, the browser correctly displays the deadline as `10:00 AM on Dec 31, 2024 (Toronto time)`. This prevents confusion and ensures users see the actual deadline in their timezone.

This behaviour is the opposite of `.toISOString()`, which always converts dates to UTC. Using both correctly ensures consistent storage and accurate timezone conversions, preventing misunderstandings.

## Best practices for displaying date-time in the front end

There's no single best way to display date-time in the front-end as it largely depends on product requirements and team consensus. Different applications have different needs, whether it's prioritizing localization, clarity, or usability.

That said, I really like how `Stripe` handles this. Instead of just showing a raw timestamp, Stripe displays a text value, and when you hover over it, a tooltip appears with the same timestamp in three different time zones:

- **Local Time** – The user's browser time zone.


- **UTC** – A universal reference, useful for consistency.
- **Organization Time Zone** – A user-selected time zone, typically set during sign-up or in account settings.

This approach strikes a great balance between readability and flexibility, making it easy for users across different time zones to interpret the date-time correctly.

![Image showing timestamps in different timezones using tooltip](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb2s2x7xst3qjwmqj01q.png)

You can use libraries like `dayjs` or `date-fns` to format date to different timezones.

## Conclusion
Handling timezones correctly is essential to avoid errors and inconsistencies in applications. By following these best practices (storing timestamps in UTC, using timezone-aware objects, and converting for display), you can ensure a smooth experience for users worldwide.

🚀 **Final Takeaways**:
 - Always work with `timestamps` instead of just `date` or `time`.
 - Always use full `ISO8601` format (i.e.`YYYY-MM-DDTHH:mm:ssZ`).


