Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  scope :threAS3 do
    resources :suites
    resources :scenarios
    resources :steps
    resources :suite_runs
    resources :scenario_runs
  end
end
