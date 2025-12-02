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
        weight = 1
        
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
                weight = 1
        elif 'weight' in row and pd.notna(row['weight']):
            try:
                weight = float(row['weight'])
            except (ValueError, TypeError):
                weight = 1
        elif 'Weight' in row and pd.notna(row['Weight']):
            try:
                weight = float(row['Weight'])
            except (ValueError, TypeError):
                weight = 1
        elif '概率' in row and pd.notna(row['概率']):
            try:
                weight = float(row['概率'])
            except (ValueError, TypeError):
                weight = 1
        else:
            # 如果没有找到，尝试使用第二列
            if len(row) > 1:
                second_col = row.index[1]
                if pd.notna(row[second_col]):
                    try:
                        weight = float(row[second_col])
                    except (ValueError, TypeError):
                        weight = 1
        
        # 如果姓名为空，跳过
        if not name:
            print(f'警告: 第{index + 1}行姓名为空，已跳过')
            continue
        
        participants.append({
            'name': name,
            'weight': weight
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

