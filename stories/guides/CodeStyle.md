# 코드 스타일

> 서비스연구담당 오동환 - 초안 작성 / 2020. 05.08 

## 1. Template

컴포넌트의 **<template~**부분은 html을 작성하고 일부 자바스크립트와 결합됩니다. 이 부분은 개발 단계 또는 빌드 단계에서 타입(형식) 체크하는 부분이 아니기 때문에, 오타 등이 있을 경우 runtime에서만 볼 수 있습니다.

따라서 **최소한의 자바스크립트만 사용** 합니다.


### a. 복잡한 자바스크립트 사용하지 않기

~~~javascript
/** Bad case */
/** 변수가 비어 있거나 속성이 비어있을 수 있기 때문에 computed를 사용하는 것이 좋음 */
<data-label
        :value="
            currentActivityOffer.owner.name +
            ' ' +
            currentActivityOffer.owner.surname
        "
        class="flex-1 justify-content-center"
        label="Owner"
/>
         

/** Good case*/
<data-label
        :value="currentActivityOfferOwnerNameSurname"
        class="flex-1 justify-content-center"
        label="Owner"
/>

~~~

### b. 동일한 명명 규칙 및 속성 순서 사용

~~~javascript
<my-component
    v-if="isVibile"
    v-model="myModel"
    :my-awesome-prop="myProp"
    @my-event="onMyEvent"
/>
~~~

​    

## 2. Script

### a. Function 내에 비지니스 로직 작성하지 않기

component에 있는 function은 컴포넌트 state나 특정 함수를 호출하는 코드만 포함하도록 해서, 컴포넌트 및 로직 기능에 대한 테스트를 쉽게 작성할 수 있도록 합니다.

~~~javascript

/** Bad case */
get doseCalculationMultiplier() {
    return (product: OrderDrugProductModel) => {
        if (
            !product.doseIntegrityType ||
            product.doseIntegrityType != EnumDoseIntegrityType.Calculated
        )
            return 0;
        if (!product.doseCalculationType) return 0;
.
.
.  
     };
}

/** Good case*/
get doseCalculationMultiplier() {
    return (product: OrderDrugProductModel) =>
        OrderDrugHelper.doseCalculationMultiplier(product, this.model);
}
~~~

### b. Computed , Watcher

두 개 이상의 prop이나 데이터의 변화를 watch하여 특정한 동작을 수행하려면, 두 개의 watch function을 만드는 대신, 하나의 computed property로 묶어서 이것을 바라보도록 합니다.

~~~javascript
/** Bad case */
name:string = '';
secondName:string  ='';

@Watch("name")
onNameChanged(){
    ...
}
@Watch("secondName")
onSecondNameChanged(){
    ...
}
    

/** Good case*/
name:string = '';
secondName:string  ='';
  
get fullName(){
    return `${this.name} ${this.secondName}`
}
  
@Watch("fullName")
onFullNameChanged(){
    ...
}
~~~

**@ 또한 무한 루프나 성능 이슈가 발생할 수 있으므로 computed 에서 state를 변경하는 코드를 작성하지 않도록 합니다.**

   

### c. 비지니스 로직
#### Functions
- function 이름과 parameter 이름은 명확하게 (줄임말 X)

  ~~~javascript
  /** Bad case */
  caclPersName(pers:Personnel):Personnel{
      ...
  }
   
  /** Good case */
  calculatePersonnelName(personnel:Personnel):Personnel{
      ...
  }
  ~~~

- 항상 리턴 타입을 추가

  ~~~javascript
  /** Bad case */
  async getPatient(id:number){
      ...
  }
      
  /** Good case */
  async getPatient(id:number):Promise<Patient>{
      ...
  }
  ~~~

- function은 항상 하나의 일만 하도록 합니다.

  function에 둘 이상의 작업을 수행하는 코드가 있을 경우, 각 작업에 대해 다른 function을 작성하여 사용합니다.

- 빠르게 return

  얽혀있는 if 블록을 사용하지 말고, 일찍 return해서 코드를 깨끗하게 합니다.

  ~~~javascript
  /** Bad case */
  coolFunction(param:string,param2:boolean):void{
      if(param)
      {
          if(param2)
          {
              ...
          }
          else{
              throw ...
          }
      }
      else{
          throw ...
      }
  }
            
  /** Good case */
  coolFunction(param:string,param2:boolean):void{
      if(!param) throw ...
      
      if(!param2) throw ...
     
      ...
  }
  ~~~

- 복잡한 if statements 를 사용하지 않기

  ~~~javascript
  /** Bad case */
  if(param.indexOf('text') > -1 || param2 % 20 === 0)
  {
      ...
  }
      
  /** Good case */
  let paramContainsText:boolean = param.indexOf('text') > -1;
  let canParam2DividedBy20:boolean = param2 % 20 === 0;
  if(paramContainsText || canParam2DividedBy20)
  {
      ...
  }
  ~~~

- 전달인자(arguments)가 많은 경우 object 사용하기

  일부 function에는 많은 전달인자가 필요하며 이러한 전달인수 중 일부는 선택일 경우, object를 사용합니다.

  ~~~javascript
  /** Bad case */
  static async getDocumentProcesses(
      visitId?: number,
      take?: number,
      skip?: number,
      code?: string,
      id?: number,
      documentCategory?: string,
      search?: string,
      keys?: number[],
      include?: string[],
      orderBy?: string,
      documentType?: EnumDocumentType,
      patientId?: number,
      getAll?: boolean,
      clientId?: number
  )
      ..
  ----------------------------------------------------------------
  getDocumentProcessesFull(
      undefined,
      undefined,
      undefined,
      this.documentCode,
      undefined,
      undefined,
      this.visit.patientId,
      undefined,
      undefined,
      true
  );
  
  /** Good case */
  static async getDocumentProcesses(
   options:{
      visitId?: number,
      take?: number,
      skip?: number,
      code?: string,
      id?: number,
      documentCategory?: string,
      search?: string,
      keys?: number[],
      include?: string[],
      orderBy?: string,
      documentType?: EnumDocumentType,
      patientId?: number,
      getAll?: boolean,
      clientId?: number
    }
  )
      ..
  -----------------------------------------------------------------
  getDocumentProcessesFull(
     {
       code:this.documentCode,
       patientOd:this.patientId
     }
  );
  ~~~





