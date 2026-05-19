import json
from app.db.database import get_db_pool

async def get_all_metadata():
    pool = await get_db_pool()
    
    async with pool.acquire() as conn:
        # Fetch options
        options_query = """
            SELECT field_name, value, label, metadata 
            FROM options 
            WHERE is_active = TRUE
        """
        options_rows = await conn.fetch(options_query)
        
        # Fetch rules
        rules_query = """
            SELECT screen_name, field_name, depends_on, rules 
            FROM rules 
            WHERE is_active = TRUE
        """
        rules_rows = await conn.fetch(rules_query)
        
        # Structure options
        structured_options = {}
        for row in options_rows:
            field_name = row['field_name']
            if field_name not in structured_options:
                structured_options[field_name] = []
            
            option_data = {
                "value": row['value'],
                "label": row['label']
            }
            
            # Conditionally include metadata
            meta = row['metadata']
            if meta:
                # Ensure it's treated as a dict if it's a string, though asyncpg usually handles jsonb
                if isinstance(meta, str):
                    try:
                        meta = json.loads(meta)
                    except:
                        pass
                
                if meta: # check again if it's not empty dict
                    option_data["metadata"] = meta
                    
            structured_options[field_name].append(option_data)
            
        # Structure rules
        structured_rules = []
        for row in rules_rows:
            rule_data = {
                "screen_name": row['screen_name'],
                "field_name": row['field_name'],
                "depends_on": row['depends_on'],
                "rules": row['rules']
            }
            
            # asyncpg converts jsonb to dict/list automatically
            if isinstance(rule_data['rules'], str):
                rule_data['rules'] = json.loads(rule_data['rules'])
                
            structured_rules.append(rule_data)
            
        return {
            "options": structured_options,
            "rules": structured_rules
        }
