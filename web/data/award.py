import pandas as pd
import json
import os
import sys
from pathlib import Path

# 指定文件路径
script_dir = Path(__file__).parent
excel_file_path = script_dir / '奖项设置.xlsx'
output_json_path = script_dir / '奖项设置.json'

try:
    # 读取Excel文件
    print('正在读取Excel文件:', excel_file_path)
    df = pd.read_excel(excel_file_path, sheet_name=0)
    
    print('读取到', len(df), '条记录')
    if len(df) > 0:
        print('示例数据:', df.iloc[0].to_dict())
    
    # 转换数据格式
    awards = []
    
    for index, row in df.iterrows():
        # 尝试从不同的列名中获取数据
        # 常见的列名：奖项名称、名称、name、Name、奖项等
        name = ''
        quantity = 1
        rule = 'rule1'  # 默认规则1
        image = ''  # 图片路径，可选
        
        # 查找奖项名称列
        if '奖项名称' in row and pd.notna(row['奖项名称']):
            name = str(row['奖项名称']).strip()
        elif '名称' in row and pd.notna(row['名称']):
            name = str(row['名称']).strip()
        elif 'name' in row and pd.notna(row['name']):
            name = str(row['name']).strip()
        elif 'Name' in row and pd.notna(row['Name']):
            name = str(row['Name']).strip()
        elif '奖项' in row and pd.notna(row['奖项']):
            name = str(row['奖项']).strip()
        else:
            # 如果没有找到，尝试使用第一列
            if len(row) > 0:
                first_col = row.index[0]
                if pd.notna(row[first_col]):
                    name = str(row[first_col]).strip()
        
        # 查找数量列
        if '数量' in row and pd.notna(row['数量']):
            try:
                quantity = int(float(row['数量']))
            except (ValueError, TypeError):
                quantity = 1
        elif 'quantity' in row and pd.notna(row['quantity']):
            try:
                quantity = int(float(row['quantity']))
            except (ValueError, TypeError):
                quantity = 1
        elif 'Quantity' in row and pd.notna(row['Quantity']):
            try:
                quantity = int(float(row['Quantity']))
            except (ValueError, TypeError):
                quantity = 1
        else:
            # 如果没有找到，尝试使用第二列
            if len(row) > 1:
                second_col = row.index[1]
                if pd.notna(row[second_col]):
                    try:
                        quantity = int(float(row[second_col]))
                    except (ValueError, TypeError):
                        quantity = 1
        
        # 查找规则列
        if '规则' in row and pd.notna(row['规则']):
            rule_str = str(row['规则']).strip().lower()
            if 'rule1' in rule_str or '规则1' in rule_str or rule_str == '1':
                rule = 'rule1'
            elif 'rule2' in rule_str or '规则2' in rule_str or rule_str == '2':
                rule = 'rule2'
        elif 'rule' in row and pd.notna(row['rule']):
            rule_str = str(row['rule']).strip().lower()
            if 'rule1' in rule_str or rule_str == '1':
                rule = 'rule1'
            elif 'rule2' in rule_str or rule_str == '2':
                rule = 'rule2'
        elif 'Rule' in row and pd.notna(row['Rule']):
            rule_str = str(row['Rule']).strip().lower()
            if 'rule1' in rule_str or rule_str == '1':
                rule = 'rule1'
            elif 'rule2' in rule_str or rule_str == '2':
                rule = 'rule2'
        
        # 查找图片路径列
        if '图片' in row and pd.notna(row['图片']):
            image = str(row['图片']).strip()
        elif '图片路径' in row and pd.notna(row['图片路径']):
            image = str(row['图片路径']).strip()
        elif 'image' in row and pd.notna(row['image']):
            image = str(row['image']).strip()
        elif 'Image' in row and pd.notna(row['Image']):
            image = str(row['Image']).strip()
        elif 'path' in row and pd.notna(row['path']):
            image = str(row['path']).strip()
        else:
            # 如果没有找到，尝试使用最后一列
            if len(row) > 2:
                last_col = row.index[-1]
                if pd.notna(row[last_col]):
                    image = str(row[last_col]).strip()
        
        # 如果名称为空，跳过
        if not name:
            print(f'警告: 第{index + 1}行奖项名称为空，已跳过')
            continue
        
        # 如果图片路径为空，设置默认值
        if not image:
            image = '/素材库/奖项1.png'  # 默认图片路径
        
        awards.append({
            'name': name,
            'quantity': quantity,
            'rule': rule,
            'image': image
        })
    
    # 保存为JSON文件
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(awards, f, ensure_ascii=False, indent=2)
    
    print('转换成功！')
    print('输出文件:', output_json_path)
    print('共转换', len(awards), '条有效记录')
    print('\nJSON格式预览:')
    preview = awards[:3]
    print(json.dumps(preview, ensure_ascii=False, indent=2))
    if len(awards) > 3:
        print('...')
    
    print('\n字段说明:')
    print('- name: 奖项名称（必填）')
    print('- quantity: 奖项数量（必填，默认为1）')
    print('- rule: 抽奖规则（必填，rule1 或 rule2，默认为 rule1）')
    print('- image: 图片路径（可选，默认为 /素材库/奖项1.png）')
    
except FileNotFoundError as e:
    print(f'错误: 找不到文件 {excel_file_path}')
    print(f'错误详情: {e}')
    sys.exit(1)
except Exception as e:
    print(f'转换失败: {e}')
    print(f'错误详情: {type(e).__name__}: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)

