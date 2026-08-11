---
title: "Running python terminal with Pyscript"
date: 2022-06-03T11:30:03+00:00
# weight: 1
# aliases: ["/first"]
tags: ["Leetcode", "Python", "Problem"]
author: "Rustam A. Lukmanov"
# author: ["Me", "You"] # multiple authors
showToc: false
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Running interactive python repl"
disableHLJS: false # to disable highlightjs
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowPostNavLinks: true
cover:
    image:  # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: true # only hide on current single page

---

<p></p>
As an exercise we will use the leetcode solution of the 2Sum problem (using 2-pointer approach).
Problem description: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

```python
def twoSum(nums, target):

        nums_index = [(v, index) for index, v in enumerate(nums)]
        nums_index.sort()
        begin, end = 0, len(nums) - 1
        while begin < end:
            curr = nums_index[begin][0] + nums_index[end][0]
            if curr == target:
                return [nums_index[begin][1], nums_index[end][1]]
            elif curr < target:
                begin += 1
            else:
                end -= 1

nums = [4,2,5,2,3,7,4,8]
target = 6
twoSum(nums, target)
```

Now, let's try to run this code here in the browser using Pyscript and repl. Just copy, paste the code into interactive Python repl and press the green button.


<div class="wrapper">
  <!-- The padding-bottom value is calculated by dividing the height by the width of the iframe and multiplying by 100 -->
  <!-- For example, if the iframe is 100% by 700px, then the padding-bottom is 700 / 100 * 100 = 700% -->
  <div class="iframe-container" style="padding-bottom: 100%; position: relative; overflow: hidden;">
    <iframe loading="lazy" src="/pyscript-environment.html" style="height:100%;width:100%;position:absolute;top:0;left:0;"></iframe>
  </div>
</div>