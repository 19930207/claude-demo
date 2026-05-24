# -*- coding: utf-8 -*-
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

if __name__ == "__main__":
    import sys
    import io
    
    # 设置stdout为UTF-8编码
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    numbers = [64, 34, 25, 12, 22, 11, 90]
    print(f"原数组: {numbers}")
    sorted_numbers = bubble_sort(numbers.copy())
    print(f"排序后: {sorted_numbers}")