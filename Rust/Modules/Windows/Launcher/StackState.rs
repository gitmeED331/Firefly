use crate::ags::{Service, Variable};

pub struct StackState {
    items: Vec<String>,
    value: String,
}

impl StackState {
    pub fn new(value: String) -> Self {
        Service::register(Self {}, HashMap::new(), HashMap::new());
        Self {
            items: Vec::new(),
            value,
        }
    }

    pub fn set_index(&mut self, idx: usize) {
        self.value = self.items[idx.min(self.items.len() - 1)];
    }

    pub fn next(&mut self) {
        let index = self.items.iter().position(|item| item == &self.value).unwrap_or(0) + 1;
        self.value = self.items[index % self.items.len()].clone();
    }

    pub fn prev(&mut self) {
        let index = self.items.iter().position(|item| item == &self.value).unwrap_or(0) - 1 + self.items.len();
        self.value = self.items[index % self.items.len()].clone();
    }
}