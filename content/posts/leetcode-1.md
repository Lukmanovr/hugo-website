---
title: "Running a Python terminal in the browser with PyScript"
date: 2022-06-03T11:30:03+00:00
tags: ["python", "pyscript"]
author: "Rustam A. Lukmanov"
description: "An interactive Python REPL embedded in the page with PyScript, demonstrated on the classic two-sum problem."
showToc: false
ShowReadingTime: true
---

As an exercise, let's take the classic two-sum problem: given an array of integers and a target, return the indices of the two numbers that add up to the target — assuming exactly one solution exists and each element may be used once. Here is the two-pointer solution:

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

Or run it right here in the browser — the editor below is preloaded with the same code; press the run button in its corner. The first run downloads the Python runtime, so give it a few seconds.

<div class="wrapper">
  <div class="iframe-container" style="padding-bottom: 100%; position: relative; overflow: hidden;">
    <iframe loading="lazy" src="/pyscript-environment.html" style="height:100%;width:100%;position:absolute;top:0;left:0;" title="Interactive Python REPL (PyScript)"></iframe>
  </div>
</div>
