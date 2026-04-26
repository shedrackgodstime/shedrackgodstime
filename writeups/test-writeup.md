---
title: "Testing the Full Markdown Pipeline"
date: "2026-04"
category: "Architecture"
readTime: "5 min read"
excerpt: "A comprehensive test of the markdown rendering pipeline including code blocks, tables, blockquotes, lists, and images."
---

Welcome to the test writeup! This file demonstrates all the markdown features now supported in the portfolio.

## Introduction

The previous implementation used a **minimal custom parser** that only handled:

- `##` headings
- `inline code`

Now we have full GitHub-style rendering powered by `marked` + `highlight.js` + `@tailwindcss/typography`.

## Images

Here is a test image:

![Test Image](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop)

## Code Blocks

### JavaScript

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet("Shedrack");
```

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.random(),
    name,
    email,
    isActive: true,
  };
}
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))
```

### Bash/Shell

```bash
#!/bin/bash
echo "Building the project..."
npm run build
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy ./dist
```

### JSON Configuration

```json
{
  "name": "shedrackgodstime",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite --mode ssr",
    "build": "qwik build"
  },
  "dependencies": {
    "@builder.io/qwik": "^1.19.2"
  }
}
```

### SQL

```sql
SELECT
    users.name,
    COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.is_active = true
GROUP BY users.id
ORDER BY order_count DESC
LIMIT 10;
```

### Rust

```rust
use std::collections::HashMap;

struct User {
    id: u32,
    name: String,
    email: String,
    is_active: bool,
}

impl User {
    fn new(id: u32, name: String, email: String) -> Self {
        Self {
            id,
            name,
            email,
            is_active: true,
        }
    }

    fn deactivate(&mut self) {
        self.is_active = false;
    }
}

fn main() {
    let mut users = HashMap::new();

    let user = User::new(
        1,
        String::from("Shedrack"),
        String::from("shedrack@example.com"),
    );

    users.insert(user.id, user);

    println!("Total users: {}", users.len());
}
```

## Blockquotes

> This is a blockquote. It's useful for highlighting important information or quotes from external sources.
>
> It can span multiple lines and maintains proper styling.

> **Pro tip:** Use blockquotes to emphasize key takeaways or callouts.

## Tables

### User Statistics

| Name     | Role          | Status   | Projects |
| -------- | ------------- | -------- | -------- |
| Shedrack | Lead Engineer | Active   | 12       |
| John     | Backend Dev   | Active   | 8        |
| Sarah    | Designer      | Inactive | 5        |

### Feature Comparison

| Feature           | Previous | Current                |
| ----------------- | -------- | ---------------------- |
| Code highlighting | ❌       | ✅ 10+ languages       |
| Tables            | ❌       | ✅ Styled              |
| Blockquotes       | ❌       | ✅ With accent border  |
| Images            | ❌       | ✅ With shadow         |
| Lists             | ❌       | ✅ Ordered & unordered |

## Lists

### Unordered Lists

- First item with some longer text to see how it wraps
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered Lists

1. Initialize the project
2. Configure the markdown parser
3. Add syntax highlighting
4. Style with Tailwind
5. Deploy to production

## Inline Code

You can use inline code like `const x = 42` or `npm install` within sentences.

## Links

- [GitHub](https://github.com)
- [Qwik Documentation](https://qwik.dev)
- [Tailwind CSS](https://tailwindcss.com)

## Horizontal Rules

Use horizontal rules to separate sections:

---

## Conclusion

If everything renders correctly, you should see:

- ✅ Syntax highlighted code blocks in multiple languages
- ✅ Beautiful blockquotes with blue accent border
- ✅ Clean tables with alternating rows
- ✅ Properly styled lists (both ordered and unordered)
- ✅ Inline code within paragraphs
- ✅ Links that match the theme
- ✅ Smooth typography throughout

The markdown pipeline is now fully operational!
