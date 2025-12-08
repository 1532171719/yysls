import pandas as pd
import json
import os
import sys
from pathlib import Path

# 指定文件路径
script_dir = Path(__file__).parent
excel_file_path = script_dir / '参选名单.xlsx'
output_json_path = script_dir / '参选名单.json'

try:
    # 读取Excel文件
    print('正在读取Excel文件:', excel_file_path)
    df = pd.read_excel(excel_file_path, sheet_name=0)
    
    print('读取到', len(df), '条记录')
    if len(df) > 0:
        print('示例数据:', df.iloc[0].to_dict())
    
    # 转换数据格式
    participants = []
    
    for index, row in df.iterrows():
        # 尝试从不同的列名中获取数据
        # 常见的列名：姓名、名字、name、Name、权重、weight、Weight、概率等
        name = ''
        weight = 0  # 默认权重为0
        level = 0  # 默认等级为0
        
        # 查找姓名列
        if '姓名' in row and pd.notna(row['姓名']):
            name = str(row['姓名']).strip()
        elif '名字' in row and pd.notna(row['名字']):
            name = str(row['名字']).strip()
        elif 'name' in row and pd.notna(row['name']):
            name = str(row['name']).strip()
        elif 'Name' in row and pd.notna(row['Name']):
            name = str(row['Name']).strip()
        elif '参与者' in row and pd.notna(row['参与者']):
            name = str(row['参与者']).strip()
        else:
            # 如果没有找到，尝试使用第一列
            if len(row) > 0:
                first_col = row.index[0]
                if pd.notna(row[first_col]):
                    name = str(row[first_col]).strip()
        
        # 查找权重列
        if '权重' in row and pd.notna(row['权重']):
            try:
                weight = float(row['权重'])
            except (ValueError, TypeError):
                weight = 0
        elif 'weight' in row and pd.notna(row['weight']):
            try:
                weight = float(row['weight'])
            except (ValueError, TypeError):
                weight = 0
        elif 'Weight' in row and pd.notna(row['Weight']):
            try:
                weight = float(row['Weight'])
            except (ValueError, TypeError):
                weight = 0
        else:
            # 如果没有找到，尝试使用第二列（如果第二列是数字）
            if len(row) > 1:
                second_col = row.index[1]
                # 检查第二列是否是权重列（通过检查列名）
                if '权重' in second_col or 'weight' in second_col.lower() or 'Weight' in second_col:
                    if pd.notna(row[second_col]):
                        try:
                            weight = float(row[second_col])
                        except (ValueError, TypeError):
                            weight = 0
                # 如果第二列是等级列，则第三列可能是权重
                elif '等级' in second_col or 'level' in second_col.lower() or 'Level' in second_col:
                    weight = 0  # 保持默认值
                # 如果第二列是数字，可能是权重或等级（需要进一步判断）
                else:
                    if pd.notna(row[second_col]):
                        try:
                            # 尝试作为权重处理
                            weight = float(row[second_col])
                        except (ValueError, TypeError):
                            weight = 0
        
        # 查找等级列
        if '等级' in row and pd.notna(row['等级']):
            try:
                level = int(float(row['等级']))
            except (ValueError, TypeError):
                level = 0
        elif 'level' in row and pd.notna(row['level']):
            try:
                level = int(float(row['level']))
            except (ValueError, TypeError):
                level = 0
        elif 'Level' in row and pd.notna(row['Level']):
            try:
                level = int(float(row['Level']))
            except (ValueError, TypeError):
                level = 0
        else:
            # 如果没有找到，尝试根据列的位置判断
            # 如果第三列存在且不是图片列，可能是等级列
            if len(row) > 2:
                third_col = row.index[2]
                # 检查是否是等级列
                if '等级' in third_col or 'level' in third_col.lower() or 'Level' in third_col:
                    if pd.notna(row[third_col]):
                        try:
                            level = int(float(row[third_col]))
                        except (ValueError, TypeError):
                            level = 0
                # 如果第二列是权重，第三列可能是等级
                elif pd.notna(row[third_col]):
                    try:
                        # 尝试作为等级处理（整数）
                        level_val = float(row[third_col])
                        if level_val == int(level_val):
                            level = int(level_val)
                        else:
                            level = 0
                    except (ValueError, TypeError):
                        level = 0
        
        # 如果姓名为空，跳过
        if not name:
            print(f'警告: 第{index + 1}行姓名为空，已跳过')
            continue
        
        participants.append({
            'name': name,
            'weight': weight,
            'level': level
        })
    
    # 保存为JSON文件
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(participants, f, ensure_ascii=False, indent=2)
    
    print('转换成功！')
    print('输出文件:', output_json_path)
    print('共转换', len(participants), '条有效记录')
    print('\nJSON格式预览:')
    preview = participants[:3]
    print(json.dumps(preview, ensure_ascii=False, indent=2))
    if len(participants) > 3:
        print('...')
    
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

