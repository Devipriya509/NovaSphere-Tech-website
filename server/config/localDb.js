const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.filePath = path.join(DATA_DIR, `${name.toLowerCase()}.json`);
  }

  _read() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
      return [];
    }
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  find(query = {}) {
    const items = this._read();
    return items.filter(item => {
      for (const key in query) {
        if (query[key] !== item[key]) return false;
      }
      return true;
    });
  }

  findOne(query = {}) {
    const items = this._read();
    return items.find(item => {
      for (const key in query) {
        if (query[key] !== item[key]) return false;
      }
      return true;
    }) || null;
  }

  findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  create(data) {
    const items = this._read();
    const newItem = {
      _id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  findByIdAndUpdate(id, data) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this._write(items);
    return items[index];
  }

  findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this._write(items);
    return deleted;
  }

  countDocuments(query = {}) {
    return this.find(query).length;
  }
}

module.exports = (name) => new Collection(name);
