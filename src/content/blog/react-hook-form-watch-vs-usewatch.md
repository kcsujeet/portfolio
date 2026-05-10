---
title: "React Hook Form: Understanding watch vs useWatch"
description: "A look at differences between watch and useWatch in react-hook-form."
pubDate: 2025-02-04T12:00:00-04:00
tags: ["react", "reacthookform", "watch", "usewatch"]
devto: "https://dev.to/kcsujeet/react-hook-form-understanding-watch-vs-usewatch-l54"
---

## Introduction

When working with forms in React, handling state efficiently is crucial to maintaining good performance. React Hook Form (RHF) provides two powerful utilities, `watch` and `useWatch`, to track form values in real-time. However, many developers struggle to understand their differences and when to use each.

When I worked with RHF, I thought both do the same thing and one is a replacement of other. The RHF documentation also doesn't go into depth explaining the differences between these two. It simply say " `useWatch` behaves similarly to the `watch` API, however, this will isolate re-rendering at the custom hook level" and that's it. 

I knew this meant `useWatch` gives better performance but I wasn't sure in what way or by how much. I also wasn't aware how important the difference between these two is. This was until I hit a bottleneck in a very large form.

So, in this article I will layout my findings and we'll explore:
✅ Key differences between them
✅ Real-world examples
✅ When to use `watch` vs `useWatch` for better performance

Let's dive in! 🚀

## Differences between watch and useWatch:
The main difference that we are concerned with is performance. According to the docs:

- `watch` : This API will trigger re-render at the root of your app or form.

- `useWatch` : Behaves similarly to the `watch` API, however, this will isolate re-rendering at the custom hook level.

Now, what does this mean? … Let's see the differences using real world examples.

## Real-world examples:
`watch` triggers a re-render the root level i.e. at the component where you initialize the form. 
![watch-triggering-rerender-of-entire-form](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fwxa3wha0z0fkrrd5tuq.gif)

Check it out yourself: https://codesandbox.io/p/sandbox/how-watch-works-gvllkd

`useWatch` only triggers a re-render in the component where you call the hook.  
![useWatch-triggering-rerender-of-just-the-input-component](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qgewz6tws0mq448uymvp.gif)

Check it out yourself: https://codesandbox.io/p/sandbox/how-usewatch-works-x2szsd

## When to Use watch vs useWatch?
As a rule of thumb, always use `useWatch`. The performance difference between these two is insignificant in small forms with just a few inputs such as a login form. However, in large forms with several inputs such as date-pickers, selects, comboboxes etc, the performance difference is clearly noticeable, especially in older devices.

So, does this mean you should never use `watch`? Absolutely not, there's always a case where one tool might be useful over the other. However, I have yet to come across such situation in a real world scenario. So, I'd suggest stick to `useWatch` unless you find it not fit to your use case.

## Conclusion
Both `watch` and `useWatch` are essential tools in React Hook Form, but one re-renders entire form and the other re-renders just the component where it's used.

🚀 **Final Takeaways**:
- Use `useWatch` almost always.
- Use `watch` when you are absolutely sure it's what you need.